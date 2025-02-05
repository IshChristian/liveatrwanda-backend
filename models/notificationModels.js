const mongoose = require('mongoose');

const notiSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    type: {
        type: String,
        enum: [
            'new_message',
            'property_inquiry',
            'booking_request',
            'payment_received',
            'viewing_scheduled',
            'price_update',
            'property_status_change'
        ],
        required: true
    },
    title: String,
    message: String,
    data: {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'property'
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'booking'
        },
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'message'
        }
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

notiSchema.index({user: 1, read: 1})

module.exports = mongoose.model('notification',  notiSchema);