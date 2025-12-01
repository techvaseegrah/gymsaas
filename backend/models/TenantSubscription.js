const mongoose = require('mongoose');

const tenantSubscriptionSchema = new mongoose.Schema({
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    planName: { type: String, enum: ['Basic', 'Pro', 'Enterprise'], required: true },
    amount: { type: Number, required: true }, // Amount the Gym paid YOU
    status: { type: String, enum: ['Active', 'Expired', 'Cancelled'], default: 'Active' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    paymentMethod: { type: String, default: 'Stripe' } // or Bank Transfer, etc.
}, { timestamps: true });

module.exports = mongoose.model('TenantSubscription', tenantSubscriptionSchema);