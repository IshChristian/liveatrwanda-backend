const express = require('express');
const router = express.Router();
const Review = require('../controllers/reviewController');

// POST /reviews
router.put('/rate', Review.createReview);
router.post('/view', Review.createview);
router.get('/reviews/:propertyID', Review.ratebyID);

module.exports = router;
