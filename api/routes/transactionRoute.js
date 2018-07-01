const express = require('express');
const router = express.Router();
const controller = require('../controlllers/transactionController')

router.get('/', controller.transactionList);
router.post('/', controller.transactionAdd);
router.patch('/:transactionId', controller.transactionUpdate);
router.get('/:transactionId', controller.transactionGet);
router.delete('/:transactionId', controller.transactionDelete);

module.exports = router;