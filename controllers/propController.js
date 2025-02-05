const Property = require("../models/propertyModel");

// Get All Properties
exports.getProperties = async (req, res) => {
  try {
    const data = await Property.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findProperty = async (req, res) => {
  try {
    // Extract the property ID from the request parameters
    const propertyID = req.params.id;

    // Use findById to query by the MongoDB _id field
    const property = await Property.findById(propertyID);

    // Check if the property exists
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Return the property data
    res.status(200).json(property);
  } catch (error) {
    console.error("Error finding property:", error.message);
    res.status(500).json({ error: "Server error while fetching property" });
  }
};

// Find a Property by ID
exports.findIDProperty = async (req, res) => {
  try {
    // const { userID } = req.body;
    const data = await Property.find({ owner: req.params.userID });
    if (!data.length) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find Properties by Location Address (with a limit of 5)
exports.findByLocation = async (req, res) => {
  try {
    const { address } = req.params; // assuming the address is passed as a query parameter
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // Search for properties by address (partial match using regex)
    const data = await Property.find({ "location.address": { $regex: address, $options: 'i' } }).limit(5); // Limit to 5 results

    if (!data.length) {
      return res.status(404).json({ message: "No properties found at the specified location" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Add a New Property
exports.createProperty = async (req, res) => {
  const {
    title,
    type,
    purpose,
    status,
    price,
    period,
    location = {}, // Default to an empty object if location is missing
    details = {},  // Default to an empty object if details are missing
    features = [], // Default to an empty array if features are missing
    images = [],   // Default to an empty array if images are missing
    description,   // Corrected typo from `descripting`
    owner,
  } = req.body;

  // Safely extract nested fields with defaults
  const {
    address = "",
    city = "",
    state = "",
    zipCode = "",
  } = location;

  const {
    area = 0,
    bedroom = 0,
    bathroom = 0,
    parking = 0,
    yearBuilt = 0,
  } = details;

  try {
    // Create a new property instance
    const newProp = new Property({
      title,
      type,
      purpose,
      status,
      price,
      period,
      location: {
        address,
        city,
        state,
        zipCode,
      },
      details: {
        area,
        bedroom,
        bathroom,
        parking,
        yearBuilt,
      },
      features,
      images,
      description, // Corrected typo
      owner,
    });

    // Save the property to the database
    const post = await newProp.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating property:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    if (error.code === 11000) {
      // Include the duplicate field name in the error message
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }

    res.status(500).json({ error: "Server Error" });
  }
};

// Update a Property by ID
exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedProperty = await Property.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Property by ID
exports.deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
