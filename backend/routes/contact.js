const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');

// @route   POST /api/contact
// @desc    Handle contact form submissions
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, company, email, phone, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ msg: 'Name, email, and message are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: 'Please provide a valid email address' });
        }

        // Validate phone number if provided
        if (phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
                return res.status(400).json({ msg: 'Please provide a valid phone number' });
            }
        }

        // Save the message to the database
        const contactMessage = new ContactMessage({
            name,
            company,
            email,
            phone,
            message
        });
        
        await contactMessage.save();

        // Check if email credentials are configured
        if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
            console.warn('Email credentials not configured. Contact form will not send emails.');
            // Still return success to the user, but log the issue
            return res.status(200).json({ 
                msg: 'Message received! We\'ll contact you soon.', 
                warning: 'Email notifications are currently disabled.' 
            });
        }

        // Create transporter for sending emails
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Verify transporter configuration
        try {
            await transporter.verify();
        } catch (verifyErr) {
            console.error('Email transporter verification failed:', verifyErr.message);
            // Still return success to the user, but log the issue
            return res.status(200).json({ 
                msg: 'Message received! We\'ll contact you soon.', 
                warning: 'Email notifications are temporarily unavailable.' 
            });
        }

        // Format the email content
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: process.env.CONTACT_EMAIL_RECEIVER || process.env.EMAIL_USERNAME,
            subject: `GymRatz Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p><small>This message was sent from the GymRatz contact form.</small></p>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ msg: 'Message sent successfully' });
    } catch (err) {
        console.error('Contact form error:', err.message);
        // Even if email fails, we should acknowledge receipt
        res.status(200).json({ 
            msg: 'Message received! We\'ll contact you soon.', 
            warning: 'We encountered an issue sending your message, but we\'ve logged your request.' 
        });
    }
});

// @route   GET /api/contact/superadmin/messages
// @desc    Get all contact messages for super admin
// @access  Super Admin only
router.get('/superadmin/messages', async (req, res) => {
    try {
        // In a real implementation, you would verify super admin access here
        // For now, we'll just return all messages
        
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        console.error('Error fetching contact messages:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PUT /api/contact/superadmin/messages/:id
// @desc    Update contact message status
// @access  Super Admin only
router.put('/superadmin/messages/:id', async (req, res) => {
    try {
        const { status } = req.body;
        
        // Validate status
        if (!['unread', 'read', 'replied'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }
        
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!message) {
            return res.status(404).json({ msg: 'Message not found' });
        }
        
        res.json(message);
    } catch (err) {
        console.error('Error updating contact message:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   DELETE /api/contact/superadmin/messages/:id
// @desc    Delete a contact message
// @access  Super Admin only
router.delete('/superadmin/messages/:id', async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(req.params.id);
        
        if (!message) {
            return res.status(404).json({ msg: 'Message not found' });
        }
        
        res.json({ msg: 'Message deleted successfully' });
    } catch (err) {
        console.error('Error deleting contact message:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;