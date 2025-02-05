const userModel = require("../models/userModels");
const bcrypt = require("bcrypt");

// Get all users
exports.users = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Find a user by name
exports.findUser = async (req, res) => {
  try {
    const finds = await userModel.findOne({ name: req.params.name });
    if (!finds) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(finds);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    // Validate input fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user with email or phone already exists
    const existingUser = await userModel.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or phone already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Save the new user to the database
    const userPost = await newUser.save();
    res.status(201).json(userPost); // Respond with created user details
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message }); // Handle validation errors
    }
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Server Error" }); // Handle other server errors
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Hash the new password
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Update user failed" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.deleteOne(); // Delete user document
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "User not deleted" });
  }
};
