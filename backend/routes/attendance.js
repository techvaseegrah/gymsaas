const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Settings = require('../models/SettingsModel');
const Fighter = require('../models/Fighter');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/authMiddleware');
const { addTenantFilter } = require('../utils/tenantHelper');

// --- HELPER FUNCTIONS ---
const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371e3;
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);
    const deltaLat = toRad(coords2.latitude - coords1.latitude);
    const deltaLon = toRad(coords2.longitude - coords1.longitude);
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const verifyLocation = async (userLocation, tenantId) => {
    try {
        if (!userLocation || !userLocation.latitude || !userLocation.longitude) return { isValid: false, message: 'Invalid location' };
        const settings = await Settings.findOne(addTenantFilter({}, tenantId));
        if (!settings || !settings.location || !settings.location.enabled) return { isValid: true, message: 'Skipped' };
        const dist = haversineDistance(userLocation, settings.location);
        return dist <= (settings.location.radius || 100) ? { isValid: true } : { isValid: false, message: `Too far (${Math.round(dist)}m)` };
    } catch (e) { return { isValid: false, message: e.message }; }
};

// Common Punch Logic function to reuse across routes
const performPunch = async (fighterId, tenantId, method, location) => {
    // 1. Subscription Check
    const sub = await Subscription.findOne(addTenantFilter({ fighter: fighterId, endDate: { $gte: new Date() } }, tenantId));
    if (!sub) throw { status: 400, message: 'Subscription expired' };

    // 2. Cooldown Check (2 minutes)
    const recent = await Attendance.findOne({ fighterId, updatedAt: { $gte: new Date(Date.now() - 2 * 60000) } });
    if (recent) throw { status: 400, message: 'Please wait 2 mins before punching again' };

    // 3. Location Check (if provided)
    if (location) {
        const locCheck = await verifyLocation(location, tenantId);
        if (!locCheck.isValid) throw { status: 400, message: locCheck.message };
    }

    // 4. Determine Check In or Out
    const today = new Date(); 
    today.setHours(0,0,0,0);
    
    // Find an open session (checked in today but not checked out)
    const openSession = await Attendance.findOne(addTenantFilter({ 
        fighterId, 
        checkIn: { $gte: today }, 
        checkOut: null 
    }, tenantId));

    if (openSession) {
        openSession.checkOut = new Date();
        if (location) openSession.location = location; // Update location on check out
        openSession.method = method; // Update method used for checkout
        await openSession.save();
        return { msg: 'Checked OUT Successfully', attendance: openSession, type: 'out' };
    } else {
        const newSession = new Attendance({ 
            fighterId, 
            checkIn: new Date(), 
            method, 
            tenant: tenantId, 
            location 
        });
        await newSession.save();
        return { msg: 'Checked IN Successfully', attendance: newSession, type: 'in' };
    }
};

// --- ROUTES ---

// @route   GET /api/attendance/me
// @desc    Fighter gets their own records (With Date Filter)
router.get('/me', auth, async (req, res) => {
    if (req.user.role !== 'fighter') return res.status(403).json({ msg: 'Access denied' });

    try {
        const { date } = req.query;
        let query = addTenantFilter({ fighterId: req.user.id }, req.user.tenant);

        if (date) {
            const start = new Date(date); start.setHours(0, 0, 0, 0);
            const end = new Date(date); end.setHours(23, 59, 59, 999);
            query.checkIn = { $gte: start, $lte: end };
        }

        const records = await Attendance.find(query).sort({ checkIn: -1 });

        const processed = records.map(record => {
            const plain = record.toObject();
            let duration = "Running";
            
            if (plain.checkOut) {
                const diff = new Date(plain.checkOut) - new Date(plain.checkIn);
                if (!isNaN(diff) && diff >= 0) {
                    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
                    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                    duration = `${h}:${m}:${s}`;
                } else {
                    duration = "00:00:00";
                }
            }
            return { ...plain, duration, date: plain.checkIn, checkIns: [{time: plain.checkIn}], checkOuts: plain.checkOut ? [{time: plain.checkOut}] : [] };
        });

        res.json(processed);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/attendance/all
// @desc    Get all attendance records for Admin
router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.status(403).json({ msg: 'Access denied' });

    try {
        const { date } = req.query;
        let query = addTenantFilter({}, req.user.tenant);

        if (date) {
            const start = new Date(date); start.setHours(0, 0, 0, 0);
            const end = new Date(date); end.setHours(23, 59, 59, 999);
            query.checkIn = { $gte: start, $lte: end };
        }

        const records = await Attendance.find(query)
            .populate('fighterId', 'name rfid')
            .sort({ checkIn: -1 });

        const groupedMap = {};
        records.forEach(record => {
            if (!record.fighterId) return;
            const fighterId = record.fighterId._id.toString();
            if (!groupedMap[fighterId]) {
                groupedMap[fighterId] = {
                    id: record._id,
                    fighterName: record.fighterId.name,
                    rfid: record.fighterId.rfid,
                    date: record.checkIn,
                    checkIns: [],
                    checkOuts: [],
                    totalDurationMs: 0
                };
            }
            groupedMap[fighterId].checkIns.push({ time: record.checkIn });
            if (record.checkOut) {
                groupedMap[fighterId].checkOuts.push({ time: record.checkOut });
                const diff = new Date(record.checkOut) - new Date(record.checkIn);
                if (diff > 0) groupedMap[fighterId].totalDurationMs += diff;
            }
        });

        const result = Object.values(groupedMap).map(item => {
            const ms = item.totalDurationMs;
            const h = Math.floor(ms / 3600000).toString().padStart(2, '0');
            const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
            const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
            return {
                ...item,
                duration: item.totalDurationMs > 0 ? `${h}:${m}:${s}` : "Running",
                checkIns: item.checkIns.sort((a,b) => new Date(a.time) - new Date(b.time)),
                checkOuts: item.checkOuts.sort((a,b) => new Date(a.time) - new Date(b.time))
            };
        });

        res.json(result);
    } catch (err) { res.status(500).send('Server Error'); }
});

// @route   GET /api/attendance/status/:rfid
// @desc    Admin lookup fighter status by RFID
router.get('/status/:rfid', auth, async (req, res) => {
    try {
        const { rfid } = req.params;
        const fighter = await Fighter.findOne(addTenantFilter({ rfid }, req.user.tenant));
        
        if (!fighter) {
            return res.status(404).json({ msg: 'Fighter not found' });
        }

        // Determine next action
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const lastRecord = await Attendance.findOne(addTenantFilter({ 
            fighterId: fighter._id, 
            checkIn: { $gte: today } 
        }, req.user.tenant)).sort({ checkIn: -1 });

        let nextAction = 'in';
        if (lastRecord && !lastRecord.checkOut) {
            nextAction = 'out';
        }

        res.json({
            fighter: {
                id: fighter._id,
                name: fighter.name,
                rfid: fighter.rfid,
                profilePhoto: fighter.profilePhoto
            },
            nextAction
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/attendance/admin/rfid
// @desc    Admin processes RFID punch
router.post('/admin/rfid', auth, async (req, res) => {
    try {
        const { rfid, location } = req.body;
        const fighter = await Fighter.findOne(addTenantFilter({ rfid }, req.user.tenant));
        if (!fighter) return res.status(404).json({ msg: 'Fighter not found' });

        const result = await performPunch(fighter._id, req.user.tenant, 'rfid', location);
        
        res.json({ 
            msg: result.msg, 
            fighter: { name: fighter.name },
            attendance: result.attendance 
        });
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message || 'Server Error' });
    }
});

// @route   POST /api/attendance/admin/face-recognition
// @desc    Admin processes Face Recognition punch
router.post('/admin/face-recognition', auth, async (req, res) => {
    try {
        const { faceDescriptor, location } = req.body;
        // In a real app, you would match descriptor against database here.
        // For now, we assume this endpoint is called AFTER frontend verification,
        // OR we need to implement face matching on backend.
        
        // Since the prompt context suggests frontend matching or simple simulation:
        // We will assume 'faceDescriptor' might carry a fighter ID or we simulate matching.
        
        // IMPORTANT: If you implemented full backend matching, use that.
        // If not, and frontend sends valid data, we might need a way to know WHICH fighter.
        // Typically frontend sends the ID if it matched, or backend loops through all.
        
        // FALLBACK: For this specific error fix, we ensure it doesn't crash.
        // NOTE: Actual backend face matching requires loading models on server.
        // Ideally, frontend sends `fighterId` if it verified the face.
        
        return res.status(400).json({ msg: 'Face verification requires Fighter ID from frontend match' });

    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/attendance/punch (Fighter App)
router.post('/punch', auth, async (req, res) => {
    try {
        console.log('Punch request received:', {
            userId: req.user.id,
            tenantId: req.user.tenant,
            location: req.body.location
        });
        
        // Use 'manual' instead of 'app' to match the enum values
        const result = await performPunch(req.user.id, req.user.tenant, 'manual', req.body.location);
        console.log('Punch successful:', result);
        res.json(result);
    } catch (e) {
        console.error('Punch error:', {
            message: e.message,
            stack: e.stack,
            status: e.status,
            userId: req.user.id,
            tenantId: req.user.tenant
        });
        res.status(e.status || 500).json({ msg: e.message || 'Error' });
    }
});

module.exports = router;