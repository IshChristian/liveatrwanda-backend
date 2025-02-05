const bcrypt = require("bcrypt"); // For password hashing
const userModel = require("../models/userModels");
const twilio = require("twilio");
const nodemailer = require("nodemailer");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Successful login
    return res.status(200).json(user);
  } catch (error) {
    // System error
    return res.status(500).json({ error: "System error" });
  }
};

// Fetch User Details by Email (using params)
exports.getUserDetails = async (req, res) => {
    const { email } = req.params; // Extract email from route params
  
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
  
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch user details" });
    }
  };
  

exports.updateBusinessDetails = async (req, res) => {
  const { email, accountType, businessRole } = req.body;

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update account type
    user.accountType = accountType;

    // Update or clear businessRole based on account type
    if (accountType === 'business') {
      user.businessDetails = { businessRole };
    } else {
      user.businessDetails = null; // Clear business details if not a business account
    }

    await user.save();
    res.status(200).json({ message: 'Account details updated successfully' });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  };
  
  // Twilio configuration
  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  
  // Nodemailer configuration
  const transporter = nodemailer.createTransport({
    service: "gmail", // Adjust for your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  // Utility function to generate a 6-digit verification code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
  };
  
  // Send verification code
    exports.sendVerificationCode = async (req, res) => {
      const { method, value } = req.body;
    
      try {
        const user = await userModel.findOne({ email: value });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        const verificationCode = generateVerificationCode();
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = Date.now() + 40 * 60 * 1000;
        await user.save();
    
        if (method === 'email') {
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use TLS
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
            tls: {
              rejectUnauthorized: false, // Accept self-signed certificates
            },
          });
    
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: value,
            subject: 'Your Verification Code',
            text: `Your verification code is ${verificationCode}`,
          });
        } else if (method === 'sms') {
          const twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
          );
    
          await twilioClient.messages.create({
            body: `Your verification code is ${verificationCode}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: value,
          });
        } else {
          return res.status(400).json({ error: 'Invalid method' });
        }
    
        res.status(200).json({ message: 'Verification code sent successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send verification code' });
      }
    };
  
  // Verify the code
  exports.verifyCode = async (req, res) => {
    const { email, code } = req.body;  // Getting the email and code from the request body
  
    try {
      // Find the user by email
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Validate the code and expiration
      if (
        user.verificationCode === code &&
        user.verificationCodeExpires > Date.now()
      ) {
        // Verification successful, no need to clear the code
        return res.status(200).json({ message: "Verification successful" });
      }
  
      // If the code is incorrect or expired
      return res.status(400).json({ error: "Invalid or expired verification code" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Verification failed" });
    }
  };
  