const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    // Add these fields for password reset functionality
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

module.exports = mongoose.model('Admin', adminSchema);