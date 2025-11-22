const express = require('express');
const router = express.Router();
const Settings = require('../models/SettingsModel');
const auth = require('../middleware/authMiddleware');
const { addTenantFilter } = require('../utils/tenantHelper');

// @route   GET /api/settings
// @desc    Get gym location settings
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Try to find existing settings
        let settings = await Settings.findOne(addTenantFilter({}, req.user.tenant));
        
        if (!settings) {
            // If no settings exist, create default settings securely
            try {
                settings = await Settings.create({
                    tenant: req.user.tenant,
                    location: {
                        latitude: 12.9716, 
                        longitude: 77.5946, 
                        enabled: true,
                        radius: 100
                    }
                });
            } catch (createErr) {
                // Handle race condition: If settings were created by another request milliseconds ago
                if (createErr.code === 11000) {
                    settings = await Settings.findOne(addTenantFilter({}, req.user.tenant));
                } else {
                    // Real error
                    throw createErr;
                }
            }
        }
        res.json(settings);
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

// @route   POST /api/settings
// @desc    Update gym location settings
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    
    try {
        const { location } = req.body;
        
        if (!location || typeof location !== 'object') {
            return res.status(400).json({ msg: 'Location data is required' });
        }

        // Parse and Validate Inputs
        const latitude = parseFloat(location.latitude);
        const longitude = parseFloat(location.longitude);
        let radius = parseInt(location.radius);
        const enabled = location.enabled === true || location.enabled === false ? location.enabled : true;

        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            return res.status(400).json({ msg: 'Invalid latitude' });
        }
        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            return res.status(400).json({ msg: 'Invalid longitude' });
        }
        if (isNaN(radius) || radius < 50 || radius > 500) {
            radius = 100; // Fallback to default if invalid
        }

        // Atomic Update: Find the doc and update it, OR create it if missing (upsert)
        const settings = await Settings.findOneAndUpdate(
            { tenant: req.user.tenant },
            { 
                $set: { 
                    location: {
                        latitude,
                        longitude,
                        enabled,
                        radius
                    }
                }
            },
            { 
                new: true, // Return the updated document
                upsert: true, // Create if not found
                runValidators: true, 
                setDefaultsOnInsert: true 
            }
        );

        return res.json({ msg: 'Settings updated successfully', settings });

    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

module.exports = router;