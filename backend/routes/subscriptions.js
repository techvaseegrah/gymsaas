const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const auth = require('../middleware/authMiddleware');
const { addTenantFilter } = require('../utils/tenantHelper');

// @route   POST /api/subscriptions/assign
// @desc    Admin assigns a new subscription to a fighter
// @access  Private (Admin only)
router.post('/assign', auth, async (req, res) => {
    // Security Check: Only Admins can assign subscriptions
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Only admins can assign subscriptions.' });
    }

    const { fighterId, planName, amount, durationMonths, paymentMode } = req.body;

    // Basic validation
    if (!fighterId || !planName || !amount || !durationMonths) {
        return res.status(400).json({ msg: 'Please enter all required fields.' });
    }

    try {
        // Calculate Start and End Dates
        const startDate = new Date();
        const endDate = new Date(startDate);
        
        // Add months to the start date
        endDate.setMonth(endDate.getMonth() + parseInt(durationMonths));

        // Create New Subscription Object
        const newSub = new Subscription({
            tenant: req.user.tenant, // Ensure it belongs to the current gym
            fighter: fighterId,
            planName,
            amount,
            durationMonths,
            startDate,
            endDate,
            paymentMode,
            status: 'active'
        });

        // Save to Database
        await newSub.save();
        
        res.json(newSub);
    } catch (err) {
        console.error('Error assigning subscription:', err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/subscriptions/me
// @desc    Get current active subscription for the logged-in fighter
// @access  Private (Fighter)
router.get('/me', auth, async (req, res) => {
    try {
        // Find the latest subscription that hasn't expired yet for this fighter
        const sub = await Subscription.findOne(addTenantFilter({
            fighter: req.user.id,
            endDate: { $gte: new Date() } // Only future end dates (Active)
        }, req.user.tenant)).sort({ endDate: -1 });
        
        // If no active sub, this returns null, which the frontend handles gracefully
        res.json(sub);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/subscriptions/history
// @desc    Get full subscription history for the logged-in fighter
// @access  Private (Fighter)
router.get('/history', auth, async (req, res) => {
    try {
        // Fetch all subscriptions for this fighter, sorted by most recent
        const subs = await Subscription.find(addTenantFilter({
            fighter: req.user.id
        }, req.user.tenant)).sort({ endDate: -1 });
        
        res.json(subs);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/subscriptions/fighter/:fighterId
// @desc    Get active subscription for a SPECIFIC fighter (Admin View)
// @access  Private (Admin only)
router.get('/fighter/:fighterId', auth, async (req, res) => {
    // Security: Only admins can view other fighters' subscription details
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        // Find the active subscription for the requested fighter ID
        // We use req.params.fighterId to find the specific fighter
        const sub = await Subscription.findOne(addTenantFilter({
            fighter: req.params.fighterId,
            endDate: { $gte: new Date() } // Only active/future subs
        }, req.user.tenant)).sort({ endDate: -1 });
        
        res.json(sub || null); // Return null if no active sub found
    } catch (err) {
        console.error('Error fetching fighter subscription:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;