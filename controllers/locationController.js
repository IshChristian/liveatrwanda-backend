const Location = require("../models/locationModel");
const Property = require("../models/propertyModel");

// Add or Update Location for a Property
exports.addOrUpdateLocation = async (req, res) => {
  const { propertyId, latitude, longitude, address, city, state, zipCode } = req.body;

  try {
    // Ensure the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if the location already exists
    let location = await Location.findOne({ propertyId });

    if (location) {
      // Update existing location
      location.latitude = latitude || location.latitude;
      location.longitude = longitude || location.longitude;
      location.address = address || location.address;
      location.city = city || location.city;
      location.state = state || location.state;
      location.zipCode = zipCode || location.zipCode;

      await location.save();
      return res.status(200).json({ message: "Location updated successfully", location });
    }

    // Create a new location
    location = new Location({
      propertyId,
      latitude,
      longitude,
      address,
      city,
      state,
      zipCode,
    });

    await location.save();
    res.status(201).json({ message: "Location added successfully", location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Location by Property ID
exports.getLocationByPropertyId = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const location = await Location.findOne({ propertyId });

    if (!location) {
      return res.status(404).json({ error: "Location not found for this property" });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
