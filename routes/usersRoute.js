const express = require('express');
const router = express.Router();
const controllers = require('../controllers/usersController');

router.get('/users', controllers.users);
router.get('/find/:username', controllers.findUser);
router.post('/new', controllers.createUser);
router.put('/edit/:username', controllers.updateUser);
router.delete('/remove/:username', controllers.deleteUser);

module.exports = router