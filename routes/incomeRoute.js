const express = require('express');
const router = express.Router();
const controllers = require('../controllers/incomeController');

router.get('/income', controllers.income);
router.get('/find/:source', controllers.find);
router.post('/new', controllers.new);
router.put('/edit', controllers.update);
router.delete('/remove/:userID', controllers.delete);

module.exports = router