const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/new', bookingController.createBooking);

// Get all bookings
router.get('/bookings', bookingController.getAllBookings);

// Get a booking by ID
// router.get('/find/:id', bookingController.getBookingById);

// Update a booking
router.put('/update/:id', bookingController.updateBooking);

// Delete a booking
// router.delete('/delete/:id', bookingController.deleteBooking);

// Change booking status (confirm, cancel)
router.put('/update/:id/status', bookingController.changeBookingStatus);

// Update payment status (paid, pending, failed)
router.put('/update/:id/payment-status', bookingController.updatePaymentStatus);

module.exports = router;
