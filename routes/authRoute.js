const express = require('express');
const auth = require('../auth/authentication');

const router = express.Router();

// GET /api/users/:identityToken - Get user details
router.post('/login', auth.login);
// Route to send the verification code
router.post('/send-verification-code', auth.sendVerificationCode);

// Route to verify the code
router.post('/verify-code', auth.verifyCode);

router.put('/update-business-details', auth.updateBusinessDetails);

router.get('/user-details/:email', auth.getUserDetails);

module.exports = router;
