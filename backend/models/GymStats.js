const mongoose = require('mongoose');

const gymStatsSchema = new mongoose.Schema({
    fighter: { type: mongoose.Schema.Types.ObjectId, ref: 'Fighter', required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    date: { type: Date, default: Date.now },
    metrics: {
        benchPress: { type: Number, default: 0 },
        squat: { type: Number, default: 0 },
        deadlift: { type: Number, default: 0 },
        mileRun: { type: Number, default: 0 }
    },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('GymStats', gymStatsSchema);