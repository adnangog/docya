const express = require('express');
const router = express.Router();
const controller = require('../controllers/mailController')

router.post('/add', controller.mailAdd);

module.exports = router;