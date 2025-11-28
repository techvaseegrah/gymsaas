const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Settings = require('../models/SettingsModel');
const Fighter = require('../models/Fighter');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/authMiddleware');
const { addTenantFilter } = require('../utils/tenantHelper');

// --- Utility: Calculate Distance ---
const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);
    const deltaLat = toRad(coords2.latitude - coords1.latitude);
    const deltaLon = toRad(coords2.longitude - coords1.longitude);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

// --- Utility: Verify Location ---
const verifyLocation = async (userLocation, tenantId) => {
    try {
        if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
            return { isValid: false, message: 'Invalid user location data' };
        }

        const settings = await Settings.findOne(addTenantFilter({}, tenantId));
        
        if (!settings || !settings.location) {
            return { isValid: true, message: 'Location verification skipped (Not Configured)' };
        }

        if (!settings.location.enabled) {
            return { isValid: true, message: 'Location verification disabled' };
        }

        const allowedRadius = settings.location.radius || 100;
        const gymLocation = {
            latitude: settings.location.latitude,
            longitude: settings.location.longitude
        };

        const distance = haversineDistance(userLocation, gymLocation);
        
        if (distance <= allowedRadius) {
            return { isValid: true, message: `Location verified (${Math.round(distance)}m)` };
        } else {
            return { 
                isValid: false, 
                message: `You are ${Math.round(distance)}m away. Allowed: ${allowedRadius}m.` 
            };
        }
    } catch (error) {
        console.error('Location verification error:', error.message);
        return { isValid: false, message: `Verification Error: ${error.message}` };
    }
};

// ==========================================
//               ROUTES
// ==========================================

// @route   GET /api/attendance/all
// @desc    Admin gets attendance records (Default: Today, or Filtered by Date)
router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    try {
        const { date } = req.query;
        let query = addTenantFilter({}, req.user.tenant);

        // Date Filtering Logic
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            query.checkIn = { $gte: startOfDay, $lte: endOfDay };
        } else {
            // Default: Show TODAY'S records only
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.checkIn = { $gte: today };
        }

        const allRecords = await Attendance.find(query)
            .populate('fighterId', 'name rfid') 
            .sort({ checkIn: -1 });
        
        const processedRecords = allRecords.map(record => {
            const plainRecord = record.toObject();
            let duration = "Running"; 
            
            if (plainRecord.checkOut) {
                const diff = new Date(plainRecord.checkOut) - new Date(plainRecord.checkIn);
                if (!isNaN(diff) && diff >= 0) {
                    const totalSeconds = Math.floor(diff / 1000);
                    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
                    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
                    const s = (totalSeconds % 60).toString().padStart(2, '0');
                    duration = `${h}:${m}:${s}`;
                } else {
                    duration = "00:00:00";
                }
            }

            const fighterObj = record.fighterId; 
            const fighterName = fighterObj ? fighterObj.name : 'Unknown Fighter';
            const rfid = fighterObj ? fighterObj.rfid : 'N/A';

            return {
                ...plainRecord,
                fighterName,
                rfid,
                duration
            };
        });

        res.json(processedRecords);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/attendance/me
// @desc    Fighter gets their own records
router.get('/me', auth, async (req, res) => {
    if (req.user.role !== 'fighter') return res.status(403).json({ msg: 'Access denied' });

    try {
        const { date } = req.query;
        let query = addTenantFilter({ fighterId: req.user.id }, req.user.tenant);

        // Date Filtering: If date is provided, filter. If NOT provided, return ALL history.
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            query.checkIn = { $gte: startOfDay, $lte: endOfDay };
        }

        const records = await Attendance.find(query)
            .populate('fighterId', 'name rfid')
            .sort({ checkIn: -1 });

        const processed = records.map(record => {
            const plainRecord = record.toObject();
            let duration = "Running"; // Default to running if no checkOut
            
            if (plainRecord.checkOut) {
                const diff = new Date(plainRecord.checkOut) - new Date(plainRecord.checkIn);
                if (!isNaN(diff) && diff >= 0) {
                    const totalSeconds = Math.floor(diff / 1000);
                    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
                    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
                    const s = (totalSeconds % 60).toString().padStart(2, '0');
                    duration = `${h}:${m}:${s}`;
                } else {
                    duration = "00:00:00";
                }
            }
            return {
                ...plainRecord,
                date: plainRecord.checkIn,
                checkIns: [{ time: plainRecord.checkIn, late: false }],
                checkOuts: plainRecord.checkOut ? [{ time: plainRecord.checkOut, late: false }] : [],
                duration
            };
        });

        res.json(processed);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/attendance/status/:rfid
// @desc    Get current attendance status for a specific RFID (Admin usage)
router.get('/status/:rfid', auth, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const fighter = await Fighter.findOne(addTenantFilter({ rfid: req.params.rfid }, req.user.tenant));
        
        if (!fighter) {
            return res.status(404).json({ msg: 'Fighter not found with this RFID' });
        }

        const openRecord = await Attendance.findOne({
            fighterId: fighter._id,
            checkOut: null
        });

        const status = openRecord ? 'in' : 'out';
        const nextAction = openRecord ? 'out' : 'in';

        res.json({
            status,
            nextAction, 
            fighter: {
                _id: fighter._id,
                name: fighter.name,
                rfid: fighter.rfid,
                profilePhoto: fighter.profilePhoto
            },
            lastPunch: openRecord ? openRecord.checkIn : null
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/attendance/me/status
// @desc    Fighter Status Check (Self)
router.get('/me/status', auth, async (req, res) => {
    if (req.user.role !== 'fighter') return res.status(403).json({ msg: 'Access denied' });

    try {
        const todayStart = new Date();
        todayStart.setHours(0,0,0,0);
        
        const openRecord = await Attendance.findOne(addTenantFilter({
            fighterId: req.user.id,
            checkIn: { $gte: todayStart },
            checkOut: null
        }, req.user.tenant));

        const fighter = await Fighter.findById(req.user.id).select('name fighterBatchNo');

        res.json({
            punchType: openRecord ? 'out' : 'in',
            fighter
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/attendance/rfid-status
// @desc    Check status for RFID Punch (Fighter Self-Check via Kiosk)
router.post('/rfid-status', auth, async (req, res) => {
    if (req.user.role !== 'fighter') return res.status(403).json({ msg: 'Access denied' });

    const { rfid, location } = req.body;
    if (!rfid) return res.status(400).json({ msg: 'RFID is required' });

    try {
        const fighter = await Fighter.findOne({ rfid });
        if (!fighter) return res.status(404).json({ msg: 'RFID not found' });
        if (fighter._id.toString() !== req.user.id) return res.status(403).json({ msg: 'Not your RFID' });

        const activeSubscription = await Subscription.findOne(addTenantFilter({
            fighter: fighter._id,
            endDate: { $gte: new Date() }
        }, req.user.tenant));

        if (!activeSubscription) {
            return res.status(400).json({ msg: 'Your subscription has expired.' });
        }

        if (location) {
            const locCheck = await verifyLocation(location, req.user.tenant);
            if (!locCheck.isValid) return res.status(400).json({ msg: locCheck.message });
        }

        const todayStart = new Date();
        todayStart.setHours(0,0,0,0);
        
        const lastRecord = await Attendance.findOne(addTenantFilter({ 
            fighterId: fighter._id,
            checkIn: { $gte: todayStart },
            checkOut: null
        }, req.user.tenant)).sort({ checkIn: -1 });

        res.json({
            punchType: lastRecord ? 'out' : 'in',
            fighter: { _id: fighter._id, name: fighter.name, fighterBatchNo: fighter.fighterBatchNo }
        });

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/attendance/punch
// @desc    Main Punch Function
router.post('/punch', auth, async (req, res) => {
    try {
        const fighterId = req.user.id;
        const { faceDescriptor, location } = req.body;
        
        const activeSubscription = await Subscription.findOne(addTenantFilter({
            fighter: fighterId,
            endDate: { $gte: new Date() }
        }, req.user.tenant));

        if (!activeSubscription) {
            return res.status(400).json({ msg: 'Your subscription has expired.' });
        }

        const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000);
        const recent = await Attendance.findOne({
            fighterId,
            $or: [{ checkIn: { $gte: twoMinsAgo } }, { checkOut: { $gte: twoMinsAgo } }]
        });
        if (recent) return res.status(400).json({ msg: 'Please wait 2 minutes between punches.' });

        if (location) {
            const locCheck = await verifyLocation(location, req.user.tenant);
            if (!locCheck.isValid) return res.status(400).json({ msg: locCheck.message });
        }

        const todayStart = new Date();
        todayStart.setHours(0,0,0,0);

        const openRecord = await Attendance.findOne(addTenantFilter({
            fighterId,
            checkIn: { $gte: todayStart },
            checkOut: null
        }, req.user.tenant)).sort({ checkIn: -1 });

        const method = faceDescriptor ? 'face' : 'rfid';

        if (openRecord) {
            openRecord.checkOut = new Date();
            if (location) openRecord.location = location;
            openRecord.method = method;
            await openRecord.save();
            return res.json({ msg: 'Checked OUT successfully!', attendance: openRecord });
        } else {
            const newRecord = new Attendance({
                fighterId,
                checkIn: new Date(),
                method,
                tenant: req.user.tenant,
                location
            });
            await newRecord.save();
            return res.json({ msg: 'Checked IN successfully!', attendance: newRecord });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/attendance/admin/rfid
router.post('/admin/rfid', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    
    const { rfid, location } = req.body;
    if (!rfid) return res.status(400).json({ msg: 'RFID required' });

    try {
        const fighter = await Fighter.findOne({ rfid });
        if (!fighter) return res.status(404).json({ msg: 'Fighter not found' });

        if (fighter.tenant.toString() !== req.user.tenant) {
             return res.status(403).json({ msg: 'Fighter belongs to another gym' });
        }

        if (location) {
            const locCheck = await verifyLocation(location, req.user.tenant);
            if (!locCheck.isValid) return res.status(400).json({ msg: locCheck.message });
        }

        const openRecord = await Attendance.findOne({
            fighterId: fighter._id,
            checkOut: null
        });

        if (openRecord) {
            openRecord.checkOut = new Date();
            openRecord.method = 'rfid';
            if (location) openRecord.location = location;
            await openRecord.save();
            res.json({ msg: `Checked OUT ${fighter.name}`, type: 'checkout', fighter });
        } else {
            const newRecord = new Attendance({
                fighterId: fighter._id,
                checkIn: new Date(),
                method: 'rfid',
                tenant: req.user.tenant,
                location
            });
            await newRecord.save();
            res.json({ msg: `Checked IN ${fighter.name}`, type: 'checkin', fighter });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/attendance/admin/face-recognition
router.post('/admin/face-recognition', auth, async (req, res) => {
    res.status(501).json({ msg: 'Admin Face Recognition not yet implemented on server.' });
});

module.exports = router;