const Booking = require('../models/bookingModels');
const moongose = require('mongoose');
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

  exports.getAllBookingsByTenant = async (req, res) => {
    try {
        const { tenantID } = req.params;
        
        if (!tenantID) {
            return res.status(400).json({ message: 'Tenant ID is required' });
        }

        const bookings = await Booking.find({ tenant: tenantID })
        
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this tenant' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  exports.getBookingsById = async (req, res) => {
    try {
        const { id } = req.params;

        const bookings = await Booking.findById(id)
        
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this tenant' });
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
const Property = require('../models/propertyModel');
const User = require('../models/userModels');

// Get all bookings with optional pagination and filtering
exports.getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, property, tenant, populate } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (property) query.property = property;
    if (tenant) query.tenant = tenant;
    
    // Execute query with pagination
    let bookingsQuery = Booking.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    // Handle population
    if (populate) {
      const fields = populate.split(',');
      fields.forEach(field => {
        bookingsQuery = bookingsQuery.populate(field);
      });
    }
    
    const bookings = await bookingsQuery;
    const totalBookings = await Booking.countDocuments(query);
    
    res.status(200).json({
      bookings,
      totalPages: Math.ceil(totalBookings / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getTenantById = async (req, res) => {
  try {
    const { id } = req.params;
    const mongoose = require("mongoose");

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find all properties where `owner` matches `id`
    const tenant = await User.find({ _id: id });

    if (!tenant || tenant.length === 0) {
      return res.status(404).json({ message: "No tenant found" });
    }

    // Extract property IDs from found properties
    const tenantIds = tenant.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    }));

    // Find all bookings where `property` is in the list of found properties
    const bookings = await Booking.find({ tenant: { $in: tenantIds } });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for these properties" });
    }

    res.status(200).json({ tenantIds, bookings });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const mongoose = require("mongoose");
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find all properties where `owner` matches `id`
    const properties = await Property.find({ owner: id });

    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: "No properties found for this owner" });
    }

    // Extract property IDs from found properties
    const propertyIds = properties.map((property) => property._id);

    // Find all bookings where `property` is in the list of found properties
    const bookings = await Booking.find({ property: { $in: propertyIds } });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for these properties" });
    }

    res.status(200).json({ properties, bookings });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: error.message });
  }
};




// Update booking status
// exports.updateBookingStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }
    
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );
    
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }
    
//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Update payment status
// exports.updatePaymentStatus = async (req, res) => {
//   try {
//     const { pamentStatus } = req.body;
    
//     if (!['pending', 'paid', 'failed'].includes(pamentStatus)) {
//       return res.status(400).json({ message: 'Invalid payment status' });
//     }
    
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { pamentStatus },
//       { new: true }
//     );
    
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }
    
//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Send reminder to tenant
exports.sendReminderToTenant = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('tenant');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // In a real application, you would send an email or SMS here
    // For demonstration, we'll just return a success message
    
    res.status(200).json({ message: `Reminder sent to ${booking.tenant.email}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};