const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  accountType: {
    type: String,
    required: true,
    enum: ['personal', 'business'], // Restricts values to "personal" or "business"
  },
  identityToken: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: function () {
      return this.accountType === 'personal';
    },
  },
  businessDetails: {
    businessName: {
      type: String,
      required: function () {
        return this.accountType === 'business';
      },
    },
    taxId: {
      type: String,
      required: function () {
        return this.accountType === 'business';
      },
    },
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

const Auth = mongoose.model('authentication', UserSchema);
module.exports = Auth;
