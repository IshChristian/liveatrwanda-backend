const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/new', bookingController.createBooking);

// Get all bookings
router.get('/bookings', bookingController.getAllBookings);


router.get('/tenant/:tenantID', bookingController.getAllBookingsByTenant);

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

// Get all bookings
router.get('/', bookingController.getBookings);

// Get a single booking by ID
router.get('/id/:id', bookingController.getBookingById);
router.get('/tenantid/:id', bookingController.getTenantById);
router.get('/bookingid/:id', bookingController.getBookingsById);

// Update a booking status
// router.put('/:id/status', bookingController.updateBookingStatus);

// Update a booking payment status
// router.put('/:id/payment', bookingController.updatePaymentStatus);

// Send reminder to tenant
router.post('/:id/send-reminder', bookingController.sendReminderToTenant);

// Delete a booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;

