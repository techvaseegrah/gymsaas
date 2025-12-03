const express = require('express');
const router = express.Router();
const GymStats = require('../models/GymStats');
const auth = require('../middleware/authMiddleware');
const { addTenantFilter } = require('../utils/tenantHelper');
const mongoose = require('mongoose');

// @route   POST /api/gym-stats
// @desc    Log a new workout record
router.post('/', auth, async (req, res) => {
    try {
        const { benchPress, squat, deadlift, mileRun, notes } = req.body;
        
        // Validate that fighter and tenant are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ msg: 'Invalid fighter ID' });
        }
        
        if (!mongoose.Types.ObjectId.isValid(req.user.tenant)) {
            return res.status(400).json({ msg: 'Invalid tenant ID' });
        }
        
        const newRecord = new GymStats({
            fighter: req.user.id,
            tenant: req.user.tenant,
            metrics: { benchPress, squat, deadlift, mileRun },
            notes
        });

        await newRecord.save();
        res.json(newRecord);
    } catch (err) {
        console.error(err);
        // Check if it's a validation error
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Invalid data provided', errors: err.errors });
        }
        // Check if it's a cast error (invalid ObjectId)
        if (err.name === 'CastError') {
            return res.status(400).json({ msg: 'Invalid ID format provided' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/gym-stats/me
// @desc    Get my gym stats history
router.get('/me', auth, async (req, res) => {
    try {
        // Validate that fighter ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ msg: 'Invalid fighter ID' });
        }
        
        const history = await GymStats.find(addTenantFilter({ fighter: req.user.id }, req.user.tenant))
            .sort({ date: -1 });
        res.json(history);
    } catch (err) {
        console.error(err);
        // Check if it's a cast error (invalid ObjectId)
        if (err.name === 'CastError') {
            return res.status(400).json({ msg: 'Invalid ID format provided' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;