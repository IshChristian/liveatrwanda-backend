const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String }, // Optional for manual input
  city: { type: String },    // Optional for manual input
  state: { type: String },   // Optional for manual input
  zipCode: { type: String }, // Optional for manual input
});

module.exports = mongoose.model("location", LocationSchema);
