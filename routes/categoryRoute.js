const express = require('express');
const router = express.Router();
const cates = require('../controllers/categoryController');


router.get('/category', cates.category);
router.get('/find/:name', cates.find);
router.post('/new', cates.new);
router.put('/update', cates.update);
router.delete('/delete/:userID', cates.delete);

module.exports = router