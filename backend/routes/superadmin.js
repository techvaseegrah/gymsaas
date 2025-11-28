const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const Admin = require('../models/Admin');
const auth = require('../middleware/authMiddleware');
const isSuperAdmin = require('../middleware/superAdminMiddleware');

// Apply middleware to all routes in this file
router.use(auth, isSuperAdmin);

// @route   GET api/superadmin/tenants
// @desc    Get ALL gyms (with stats)
router.get('/tenants', async (req, res) => {
    try {
        const tenants = await Tenant.find().sort({ createdAt: -1 });
        res.json(tenants);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/superadmin/tenants/:id/status
// @desc    Disable/Enable a gym (e.g. for non-payment)
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

// @route   GET api/superadmin/stats
// @desc    Platform-wide analytics
router.get('/stats', async (req, res) => {
    try {
        const totalGyms = await Tenant.countDocuments();
        const activeGyms = await Tenant.countDocuments({ isActive: true });
        const totalAdmins = await Admin.countDocuments({ role: 'admin' });
        
        res.json({
            totalGyms,
            activeGyms,
            totalAdmins,
            mrr: activeGyms * 49 // Example MRR calculation based on $49 plan
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;