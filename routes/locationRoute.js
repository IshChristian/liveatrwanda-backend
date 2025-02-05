const express = require("express");
const router = express.Router();
const { addOrUpdateLocation, getLocationByPropertyId } = require("../controllers/locationController");

// Add or Update Location
router.post("/", addOrUpdateLocation);

// Get Location by Property ID
router.get("/:propertyId", getLocationByPropertyId);

module.exports = router;
