const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController')

router.post('/', controller.transactionList);
router.post('/add', controller.transactionAdd);
router.patch('/:transactionId', controller.transactionUpdate);
router.get('/:transactionId', controller.transactionGet);
router.delete('/:transactionId', controller.transactionDelete);

module.exports = router;