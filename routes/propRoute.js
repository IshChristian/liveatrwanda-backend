const express = require('express');
const router = express.Router();
const controller = require('../controllers/propController');

router.get('/property', controller.getProperties);
router.get('/find/:id', controller.findProperty);
router.get('/find/property/:userID', controller.findIDProperty);
router.get('/find/location/:address', controller.findByLocation);
router.post('/new', controller.createProperty);
router.put('/new', controller.updateProperty);
router.delete('/new', controller.deleteProperty);

module.exports = router