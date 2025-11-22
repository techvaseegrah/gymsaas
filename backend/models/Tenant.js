const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    phone: {
        type: String
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    subscriptionPlan: {
        type: String,
        enum: ['basic', 'pro', 'enterprise'],
        default: 'basic'
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'trial', 'cancelled'],
        default: 'trial'
    },
    trialEndDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Tenant', tenantSchema);