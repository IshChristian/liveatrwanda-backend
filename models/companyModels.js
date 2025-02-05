const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['company','individual'],
        required: true
    },
    details: {
        registrationNumber: String,
        taxId: String,
        foundedYear: Number,
        website: String,
        description: String
    },
    contact: {
        email: {
            type: String,
            required: true
        },
        phone: String,
        address: String,
        city: String,
        zipCode: string
    },
    team: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        role: {
            type: String,
            enum: ['owner','manage','agent']
        },
        permissions: [{
            type: String,
            enum: ['view','edit','delete','manage_team']
        }]
    }],
    properties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'property'
    }],
    documents: [{
        type: String,
        name: String,
        url: String,
        uploadDate: Date
    }]
});

companySchema.index({name: 1})

module.exports = mongoose.model('company', companySchema);