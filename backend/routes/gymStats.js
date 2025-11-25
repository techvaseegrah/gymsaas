const express = require('express');
const router = express.Router();
const GymStats = require('../models/GymStats');
const auth = require('../middleware/authMiddleware');
const { addTenantFilter } = require('../utils/tenantHelper');

// @route   POST /api/gym-stats
// @desc    Log a new workout record
router.post('/', auth, async (req, res) => {
    try {
        const { benchPress, squat, deadlift, mileRun, notes } = req.body;
        
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
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/gym-stats/me
// @desc    Get my gym stats history
router.get('/me', auth, async (req, res) => {
    try {
        const history = await GymStats.find(addTenantFilter({ fighter: req.user.id }, req.user.tenant))
            .sort({ date: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;