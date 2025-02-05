const Booking = require('../models/bookingModels');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
      const { property, tenant, startDate, endDate, rentAmount } = req.body;
  
      const newBooking = new Booking({
        property,
        tenant,
        startDate,
        endDate,
        rentAmount,
        status: 'pending',  // default status
        paymentStatus: 'pending'  // default payment status
      });
  
      await newBooking.save();
      res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate('property', 'name address')  // Populate property details
        .populate('tenant', 'name email');    // Populate tenant details
  
      if (bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found' });
      }
  
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Update a booking by ID
exports.updateBooking = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, paymentStatus, rentAmount } = req.body;
  
      const booking = await Booking.findById(id);
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Update booking fields
      booking.status = status || booking.status;
      booking.paymentStatus = paymentStatus || booking.paymentStatus;
      booking.rentAmount = rentAmount || booking.rentAmount;
  
      await booking.save();
      res.status(200).json({ message: 'Booking updated successfully', booking });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Update booking status (confirm, cancel)
exports.changeBookingStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      const booking = await Booking.findById(id);
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      booking.status = status;
      await booking.save();
  
      res.status(200).json({ message: 'Booking status updated successfully', booking });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Update booking payment status (paid, pending, failed)
exports.updatePaymentStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;
  
      if (!['pending', 'paid', 'failed'].includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status' });
      }
  
      const booking = await Booking.findById(id);
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      booking.paymentStatus = paymentStatus;
      await booking.save();
  
      res.status(200).json({ message: 'Payment status updated successfully', booking });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  