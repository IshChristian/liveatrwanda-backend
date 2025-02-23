const express = require('express');
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByTenant,
  getPaymentsByOwner
} = require('../controllers/paymentController');

const router = express.Router();

// Base route: /api/payments
router.post('/create', createPayment);
router.get('/', getAllPayments);
router.get('/:id', getPaymentById);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);
router.get('/tenant/:tenantId', getPaymentsByTenant);
router.get('/owner/:ownerId', getPaymentsByOwner);

module.exports = router;
