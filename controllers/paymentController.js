const { Request, Response } = require('express');
const Payment = require('../models/paymentModel');

// Create a new payment record
const createPayment = async (req, res) => {
  try {
    const { bookingId, tenantId, ownerId, amount, status, phone } = req.body;

    // Validate required fields
    if (!bookingId || !tenantId || !ownerId || !amount || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const payment = new Payment({
      bookingId,
      tenantId,
      ownerId,
      amount,
      phone,
      status: status || 'pending'
    });

    const savedPayment = await payment.save();

    res.status(201).json({
      success: true,
      data: savedPayment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment record',
      error: error.message
    });
  }
};

// Get all payment records
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('bookingId', 'startDate endDate')
      .populate('tenantId', 'name email phone')
      .populate('ownerId', 'name email phone');

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment records',
      error: error.message
    });
  }
};

// Get payment record by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('bookingId', 'startDate endDate')
      .populate('tenantId', 'name email phone')
      .populate('ownerId', 'name email phone');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment record',
      error: error.message
    });
  }
};

// Update payment record
const updatePayment = async (req, res) => {
  try {
    const { status, amount, phone } = req.body;
    const paymentId = req.params.id;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Update only provided fields
    if (status) payment.status = status;
    if (amount) payment.amount = amount;
    if (phone) payment.phone = phone;

    const updatedPayment = await payment.save();

    res.status(200).json({
      success: true,
      data: updatedPayment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment record',
      error: error.message
    });
  }
};

// Delete payment record
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting payment record',
      error: error.message
    });
  }
};

const Booking = require('../models/bookingModels'); // Make sure the path is correct


// Get payments by tenant ID
const getPaymentsByTenant = async (req, res) => {
  try {
    const payments = await Payment.find({ tenantId: req.params.tenantId })
    //   .populate('bookingId', 'startDate endDate')
    //   .populate('ownerId', 'name email phone');

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tenant payments',
      error: error.message
    });
  }
};

// Get payments by owner ID
const getPaymentsByOwner = async (req, res) => {
  try {
    const payments = await Payment.find({ ownerId: req.params.ownerId })
      .populate('bookingId', 'startDate endDate')
      .populate('tenantId', 'name email phone');

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching owner payments',
      error: error.message
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByTenant,
  getPaymentsByOwner
};
