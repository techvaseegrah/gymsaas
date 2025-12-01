const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Built-in Node module
const nodemailer = require('nodemailer'); // You may need to run: npm install nodemailer
const Fighter = require('../models/Fighter');
const Admin = require('../models/Admin');
const Tenant = require('../models/Tenant');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// ... [Keep your existing /login, /user routes etc.] ...

// ==========================================
//          PASSWORD RESET ROUTES
// ==========================================

// Utility: Send Email (Mock function included for dev)
const sendEmail = async (options) => {
    // 1. Create Transporter (Configure with your SMTP credentials for production)
    // For GMail: service: 'gmail', auth: { user: '...', pass: '...' }
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER, // Add to your .env
            pass: process.env.EMAIL_PASS  // Add to your .env
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Gym Support'} <${process.env.FROM_EMAIL || 'noreply@gym.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // For development without SMTP, we just log the message
    if (!process.env.EMAIL_USER) {
        console.log('--- EMAIL SIMULATION ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('------------------------');
        return;
    }

    await transporter.sendMail(message);
};

// @route   POST api/auth/forgot-password
// @desc    Forgot Password - Send Reset Link
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // 1. Find User (Check Admin first, then Fighter)
        let user = await Admin.findOne({ email });
        let model = Admin;

        if (!user) {
            user = await Fighter.findOne({ email });
            model = Fighter;
        }

        if (!user) {
            return res.status(404).json({ msg: 'No account found with that email' });
        }

        // 2. Generate Reset Token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // 3. Hash token and save to database
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // 4. Create Reset URL
        // Assumes frontend is running on localhost:3000
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. \n\n Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message
            });

            res.json({ success: true, msg: 'Email sent' });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ msg: 'Email could not be sent' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/reset-password/:resetToken
// @desc    Reset Password using token
router.post('/reset-password/:resetToken', async (req, res) => {
    try {
        // 1. Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        // 2. Find user with valid token and expiration
        let user = await Admin.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            user = await Fighter.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() }
            });
        }

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        // 3. Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        // 4. Clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ success: true, msg: 'Password updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/change-password
// @desc    Change Password (Logged In User)
// @access  Private
router.post('/change-password', auth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // 1. Determine User Model based on role
        let user;
        if (req.user.role === 'admin') {
            user = await Admin.findById(req.user.id);
        } else {
            user = await Fighter.findById(req.user.id);
        }

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // 2. Check Old Password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect current password' });
        }

        // 3. Hash New Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ success: true, msg: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;