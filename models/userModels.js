const mongoose = require("mongoose");

const users = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  accountType: { type: String },
  businessDetails: {
    businessRole: { type: String },
  },
});

module.exports = mongoose.model("users", users);
