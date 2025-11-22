const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');
const Admin = require('../models/Admin');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   POST api/tenants/signup
// @desc    Register a new tenant (gym) and create an admin user
// @access  Public
router.post('/signup', [
    body('gymName', 'Gym name is required').notEmpty(),
    body('gymSlug', 'Gym slug is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { gymName, gymSlug, email, password, phone, address } = req.body;

    try {
        // Check if tenant already exists
        let tenant = await Tenant.findOne({ 
            $or: [
                { email: email },
                { slug: gymSlug.toLowerCase() },
                { name: gymName }
            ]
        });

        if (tenant) {
            return res.status(400).json({ msg: 'Gym already exists with this email, name, or slug' });
        }

        // Create tenant
        tenant = new Tenant({
            name: gymName,
            slug: gymSlug.toLowerCase(),
            email,
            phone,
            address
        });

        await tenant.save();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin user for this tenant
        const admin = new Admin({
            email,
            password: hashedPassword,
            role: 'admin',
            tenant: tenant._id
        });

        await admin.save();

        // Create and return JWT token
        const payload = {
            user: {
                id: admin.id,
                role: admin.role,
                tenant: tenant._id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    user: payload.user,
                    tenant: {
                        id: tenant._id,
                        name: tenant.name,
                        slug: tenant.slug
                    }
                });
            }
        );
    } catch (err) {
        console.error('Tenant signup error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/tenants/:slug
// @desc    Get tenant by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const tenant = await Tenant.findOne({ 
            slug: req.params.slug.toLowerCase(),
            isActive: true 
        }).select('-__v');

        if (!tenant) {
            return res.status(404).json({ msg: 'Gym not found' });
        }

        res.json(tenant);
    } catch (err) {
        console.error('Get tenant error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/tenants
// @desc    Get all active tenants (gyms) - limited info for security
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Only return slugs for tenant lookup, not full details
        const tenants = await Tenant.find({ isActive: true })
            .select('slug')
            .sort({ name: 1 });

        res.json(tenants);
    } catch (err) {
        console.error('Get tenants error:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;