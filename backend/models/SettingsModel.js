const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        unique: true
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        enabled: {
            type: Boolean,
            default: true
        },
        radius: {
            type: Number,
            default: 100
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);