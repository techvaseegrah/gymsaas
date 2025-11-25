const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const Fighter = require('../models/Fighter');
const TenantSubscription = require('../models/TenantSubscription'); // SaaS Payments
const auth = require('../middleware/authMiddleware');
const isSuperAdmin = require('../middleware/superAdminMiddleware');

// Protect all routes
router.use(auth, isSuperAdmin);

// @route   GET api/superadmin/dashboard
// @desc    Get platform-wide stats
router.get('/dashboard', async (req, res) => {
    try {
        const totalTenants = await Tenant.countDocuments();
        const totalFighters = await Fighter.countDocuments();
        
        // Calculate Real Revenue from TenantSubscriptions
        const payments = await TenantSubscription.find({ status: 'Active' });
        const mmr = payments.reduce((acc, sub) => acc + sub.amount, 0);

        res.json({
            totalTenants,
            totalFighters,
            mmr
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/superadmin/tenants
// @desc    Get all gyms
router.get('/tenants', async (req, res) => {
    try {
        const tenants = await Tenant.find().select('-password').sort({ createdAt: -1 });
        res.json(tenants);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/superadmin/subscriptions
// @desc    Get SaaS Payments (Gyms paying us)
router.get('/subscriptions', async (req, res) => {
    try {
        const subs = await TenantSubscription.find()
            .populate('tenant', 'name email')
            .sort({ createdAt: -1 });
        res.json(subs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/superadmin/tenants/:id/status
// @desc    Toggle Gym Status
router.put('/tenants/:id/status', async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id);
        if (!tenant) return res.status(404).json({ msg: 'Gym not found' });

        tenant.isSuspended = !tenant.isSuspended;
        tenant.isActive = !tenant.isSuspended; 
        await tenant.save();
        res.json(tenant);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;