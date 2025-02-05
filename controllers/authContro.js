const User = require('../models/auth');

// Register a new user
const registerUser = async (req, res) => {
  const { accountType, identityToken, dateOfBirth, businessDetails } = req.body;

  if (!accountType || !identityToken) {
    return res.status(400).json({ error: 'Account type and identity token are required.' });
  }

  if (accountType === 'personal' && !dateOfBirth) {
    return res.status(400).json({ error: 'Date of birth is required for personal accounts.' });
  }

  if (
    accountType === 'business' &&
    (!businessDetails || !businessDetails.businessName || !businessDetails.taxId)
  ) {
    return res.status(400).json({ error: 'Business name and tax ID are required for business accounts.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ identityToken });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Create a new user
    const user = new User({
      accountType,
      identityToken,
      dateOfBirth: accountType === 'personal' ? dateOfBirth : undefined,
      businessDetails: accountType === 'business' ? businessDetails : undefined,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// Get user details
const getUserDetails = async (req, res) => {
  const { identityToken } = req.params;

  try {
    const user = await User.findOne({ identityToken });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { registerUser, getUserDetails };
