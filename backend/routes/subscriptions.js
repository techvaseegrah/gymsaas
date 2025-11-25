const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const auth = require('../middleware/authMiddleware');
const { addTenantFilter } = require('../utils/tenantHelper');

// @route   POST /api/subscriptions/assign
// @desc    Admin assigns a new subscription
router.post('/assign', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    const { fighterId, planName, amount, durationMonths, paymentMode } = req.body;

    try {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + parseInt(durationMonths));

        const newSub = new Subscription({
            tenant: req.user.tenant,
            fighter: fighterId,
            planName,
            amount,
            durationMonths,
            startDate,
            endDate,
            paymentMode,
            status: 'active'
        });

        await newSub.save();
        res.json(newSub);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/subscriptions/me
// @desc    Fighter gets current active subscription
router.get('/me', auth, async (req, res) => {
    try {
        // Find the latest subscription that hasn't expired yet
        const sub = await Subscription.findOne(addTenantFilter({
            fighter: req.user.id,
            endDate: { $gte: new Date() }
        }, req.user.tenant)).sort({ endDate: -1 });
        
        res.json(sub);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/subscriptions/history
// @desc    Fighter gets subscription history
router.get('/history', auth, async (req, res) => {
    try {
        const subs = await Subscription.find(addTenantFilter({
            fighter: req.user.id
        }, req.user.tenant)).sort({ endDate: -1 });
        
        res.json(subs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;