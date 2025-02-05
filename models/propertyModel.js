const mongoose = require('mongoose');

const propSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['commercial','residential'],
        required: true
    },
    purpose: {
        type: String,
        enum: ['rent','sale'],
        required: true
    },
    status: {
        type: String,
        enum: ['available','rented','sold'],
        default: 'available'
    },
    price: {
        type: Number,
        required: true
    },
    period: {
        type: String,
        enum: ['monthly','yearly'],
        required: function() {
            return this.purpose === 'rent';
        }
    },
    location: {
        address: String,
        city: String,
        state: String,
        zipCode: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    details: {
        area: Number,
        bedroom: Number,
        bathroom: Number,
        parking: Number,
        yearBuilt: Number
    },
    features: [{
        type: String
    }],
    images: [{
        type: String,
        required: true
    }],
    descripting: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

propSchema.index({'location.city': 1,type: 1,purpose: 1});
propSchema.index({'price.amount':  1});
propSchema.index({status: 1});

module.exports = mongoose.model('property', propSchema);