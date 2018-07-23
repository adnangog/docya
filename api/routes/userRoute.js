const express = require('express');
const router = express.Router();
const controller = require('../controlllers/userController')

router.post('/', controller.userList);
router.post('/add', controller.userAdd);
router.post('/login', controller.userLogin);
router.patch('/:userId', controller.userUpdate);
router.get('/:userId', controller.userGet);
router.delete('/:userId', controller.userDelete);

module.exports = router;