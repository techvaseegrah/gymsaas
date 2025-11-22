const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/authMiddleware');
const { addTenantFilter } = require('../utils/tenantHelper');

// @route   GET /api/settings
// @desc    Get settings (Atomically creates default if missing)
router.get('/', async (req, res) => {
    try {
        // Atomic Find-OR-Create
        // This single command finds the settings, OR creates them if missing.
        // It prevents two requests from creating duplicates at the same time.
        const settings = await Settings.findOneAndUpdate(
            addTenantFilter({}, req.user.tenant), // Filter: Find by Tenant
            {
                $setOnInsert: { // If creating new, set these defaults:
                    tenant: req.user.tenant,
                    location: {
                        latitude: 12.9716, 
                        longitude: 77.5946, 
                        enabled: true,
                        radius: 100
                    }
                }
            },
            { 
                new: true,   // Return the document (either found or created)
                upsert: true // Create if it doesn't exist
            }
        );

        res.json(settings);
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

// @route   POST /api/settings
// @desc    Update gym location settings
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    
    try {
        const { location } = req.body;
        if (!location || typeof location !== 'object') {
            return res.status(400).json({ msg: 'Location data is required' });
        }

        // Validation
        const latitude = parseFloat(location.latitude);
        const longitude = parseFloat(location.longitude);
        let radius = parseInt(location.radius);
        const enabled = location.enabled === true || location.enabled === false ? location.enabled : true;

        if (isNaN(latitude) || latitude < -90 || latitude > 90) return res.status(400).json({ msg: 'Invalid latitude' });
        if (isNaN(longitude) || longitude < -180 || longitude > 180) return res.status(400).json({ msg: 'Invalid longitude' });
        if (isNaN(radius) || radius < 50 || radius > 500) radius = 100;

        // Atomic Update
        const settings = await Settings.findOneAndUpdate(
            { tenant: req.user.tenant },
            { 
                $set: { 
                    location: { latitude, longitude, enabled, radius }
                }
            },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        return res.json({ msg: 'Settings updated successfully', settings });

    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

module.exports = router;