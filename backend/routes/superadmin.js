const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const Admin = require('../models/Admin');
const Fighter = require('../models/Fighter');
const TenantSubscription = require('../models/TenantSubscription');
const Attendance = require('../models/Attendance');
const GymStats = require('../models/GymStats');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/authMiddleware');
const isSuperAdmin = require('../middleware/superAdminMiddleware');

// Apply middleware to all routes in this file
router.use(auth, isSuperAdmin);

// @route   GET api/superadmin/tenants
// @desc    Get ALL gyms (with member counts)
router.get('/tenants', async (req, res) => {
    try {
        // 1. Fetch all tenants
        const tenants = await Tenant.find().sort({ createdAt: -1 });
        
        // 2. Fetch member counts manually using Mongoose
        // This fixes the "0 members" issue by counting documents directly
        const tenantsWithStats = await Promise.all(tenants.map(async (tenant) => {
            try {
                const memberCount = await Fighter.countDocuments({ tenant: tenant._id });
                return { 
                    ...tenant.toObject(), 
                    memberCount 
                };
            } catch (countErr) {
                console.error(`Error counting members for gym ${tenant.name}:`, countErr);
                return { ...tenant.toObject(), memberCount: 0 };
            }
        }));

        res.json(tenantsWithStats);
    } catch (err) {
        console.error('Error fetching tenants:', err);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/superadmin/tenants/:id/payments
// @desc    Get payment history for a specific gym
router.get('/tenants/:id/payments', async (req, res) => {
    try {
        const payments = await TenantSubscription.find({ tenant: req.params.id })
            .sort({ startDate: -1 }); // Most recent first
        res.json(payments);
    } catch (err) {
        console.error('Error fetching payments:', err);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/superadmin/tenants/:id
// @desc    Update Gym Details & Admin Credentials (THE MISSING ROUTE)
router.put('/tenants/:id', async (req, res) => {
    const { gymName, email, password, phone, address } = req.body;
    
    try {
        const tenantId = req.params.id;

        // 1. Update Tenant Details
        const updatedTenant = await Tenant.findByIdAndUpdate(
            tenantId,
            { 
                name: gymName,
                email: email, // Update contact email
                phone,
                address
            },
            { new: true }
        );

        if (!updatedTenant) {
            return res.status(404).json({ msg: 'Gym not found' });
        }

        // 2. Find the main Admin for this tenant and update credentials
        const admin = await Admin.findOne({ tenant: tenantId, role: 'admin' });
        
        if (admin) {
            // Update Admin Email
            if (email) admin.email = email;
            
            // Update Password if provided and not empty
            if (password && password.trim() !== '') {
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(password, salt);
            }
            
            await admin.save();
        }

        res.json({ msg: 'Gym and Credentials updated successfully', tenant: updatedTenant });

    } catch (err) {
        console.error('Update gym error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/superadmin/tenants/:id/status
// @desc    Disable/Enable a gym
router.put('/tenants/:id/status', async (req, res) => {
    try {
        const { status } = req.body; // 'active' or 'inactive'
        
        const tenant = await Tenant.findByIdAndUpdate(
            req.params.id, 
            { 
                isActive: status === 'active',
                subscriptionStatus: status === 'active' ? 'active' : 'inactive'
            },
            { new: true }
        );
        
        res.json(tenant);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/superadmin/tenants
// @desc    Create a new gym
router.post('/tenants', async (req, res) => {
    const { gymName, gymSlug, email, password, phone, address } = req.body;

    try {
        let tenant = await Tenant.findOne({ 
            $or: [{ email }, { slug: gymSlug.toLowerCase() }, { name: gymName }]
        });

        if (tenant) {
            return res.status(400).json({ msg: 'Gym already exists with this email, name, or slug' });
        }

        tenant = new Tenant({
            name: gymName,
            slug: gymSlug.toLowerCase(),
            email,
            phone,
            address
        });
        await tenant.save();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new Admin({
            email,
            password: hashedPassword,
            role: 'admin',
            tenant: tenant._id
        });
        await admin.save();

        res.json({ msg: 'Gym created successfully' });
    } catch (err) {
        console.error('Create tenant error:', err.message);
        res.status(500).send('Server Error');
    }
});

// --- Analytics & Stats Routes ---

router.get('/stats', async (req, res) => {
    try {
        const totalGyms = await Tenant.countDocuments();
        const activeGyms = await Tenant.countDocuments({ isActive: true });
        const totalAdmins = await Admin.countDocuments({ role: 'admin' });
        const totalFighters = await Fighter.countDocuments();
        const subscriptions = await TenantSubscription.find().populate('tenant');
        const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
        
        res.json({ totalGyms, activeGyms, totalAdmins, totalFighters, mrr: activeGyms * 49, totalRevenue });
    } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/users/admins', async (req, res) => {
    try { const admins = await Admin.find({ role: 'admin' }).populate('tenant'); res.json(admins); } 
    catch (err) { res.status(500).send('Server Error'); }
});

router.get('/users/fighters', async (req, res) => {
    try { const fighters = await Fighter.find().populate('tenant'); res.json(fighters); } 
    catch (err) { res.status(500).send('Server Error'); }
});

router.get('/users/superadmins', async (req, res) => {
    try { const superadmins = await Admin.find({ role: 'superadmin' }); res.json(superadmins); } 
    catch (err) { res.status(500).send('Server Error'); }
});

router.get('/subscriptions', async (req, res) => {
    try { const subscriptions = await TenantSubscription.find().populate('tenant'); res.json(subscriptions); } 
    catch (err) { res.status(500).send('Server Error'); }
});

router.get('/dashboard', async (req, res) => {
    try {
        const totalTenants = await Tenant.countDocuments();
        const totalFighters = await Fighter.countDocuments();
        const activeTenants = await Tenant.countDocuments({ isActive: true });
        const activeSubscriptions = await TenantSubscription.find({ status: 'Active' });
        const mmr = activeSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
        res.json({ totalTenants, totalFighters, activeTenants, mmr });
    } catch (err) { res.status(500).send('Server Error'); }
});

// Analytics Charts
router.get('/analytics/user-growth', async (req, res) => {
    try {
        const fighterRegistrations = await Fighter.aggregate([
            { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        const tenantRegistrations = await Tenant.aggregate([
            { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        res.json({ fighterRegistrations, tenantRegistrations });
    } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/analytics/revenue-trends', async (req, res) => {
    try {
        const revenueTrends = await TenantSubscription.aggregate([
            { $group: { _id: { year: { $year: '$startDate' }, month: { $month: '$startDate' } }, totalRevenue: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        res.json(revenueTrends);
    } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/analytics/attendance-stats', async (req, res) => {
    try {
        const totalAttendance = await Attendance.countDocuments();
        const attendanceByMethod = await Attendance.aggregate([{ $group: { _id: '$method', count: { $sum: 1 } } }]);
        const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentAttendance = await Attendance.countDocuments({ checkIn: { $gte: thirtyDaysAgo } });
        res.json({ totalAttendance, attendanceByMethod, recentAttendance });
    } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/analytics/performance-stats', async (req, res) => {
    try {
        const totalGymStats = await GymStats.countDocuments();
        const avgMetrics = await GymStats.aggregate([{ $group: { _id: null, avgBenchPress: { $avg: '$metrics.benchPress' }, avgSquat: { $avg: '$metrics.squat' }, avgDeadlift: { $avg: '$metrics.deadlift' }, avgMileRun: { $avg: '$metrics.mileRun' } } }]);
        res.json({ totalGymStats, avgMetrics: avgMetrics[0] || {} });
    } catch (err) { res.status(500).send('Server Error'); }
});

// Settings
// In-memory storage for superadmin settings (in a real app, this would be in a database)
let superAdminSettings = {
    platformName: 'GymRatz',
    supportEmail: 'support@gymratz.com',
    maintenanceMode: false,
    autoBackup: true,
    notificationEmails: true,
    version: 'v2.1.4',
    lastBackup: '2023-06-18 14:30 UTC',
    uptime: '99.98%'
};

router.get('/settings', async (req, res) => {
    try {
        res.json(superAdminSettings);
    } catch (err) { 
        res.status(500).send('Server Error'); 
    }
});

router.post('/settings', async (req, res) => {
    try {
        // Update settings with provided values
        const { platformName, supportEmail, maintenanceMode, autoBackup, notificationEmails } = req.body;
        
        if (platformName !== undefined) superAdminSettings.platformName = platformName;
        if (supportEmail !== undefined) superAdminSettings.supportEmail = supportEmail;
        if (maintenanceMode !== undefined) superAdminSettings.maintenanceMode = maintenanceMode;
        if (autoBackup !== undefined) superAdminSettings.autoBackup = autoBackup;
        if (notificationEmails !== undefined) superAdminSettings.notificationEmails = notificationEmails;
        
        res.json({ msg: 'Settings updated successfully!', settings: superAdminSettings });
    } catch (err) { 
        res.status(500).send('Server Error'); 
    }
});

module.exports = router;