const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController')

router.post('/', controller.transactionList);
router.get('/:itemId', controller.transactionsByItemId);
router.post('/add', controller.transactionAdd);

module.exports = router;