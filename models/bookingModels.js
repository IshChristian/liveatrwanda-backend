const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'property',
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    rentAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending','confirmed','cancelled'],
        default: 'pending'
    },
    pamentStatus: {
        type: String,
        enum: ['pending','paid','failed'],
        default: 'pending'
    }
});

module.exports = mongoose.model('booking', bookingSchema);