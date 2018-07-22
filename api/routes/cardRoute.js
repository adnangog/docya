const express = require('express');
const router = express.Router();
const controller = require('../controlllers/cardController')

router.get('/', controller.cardList);
router.post('/', controller.cardAdd);
router.patch('/:cardId', controller.cardUpdate);
router.get('/:cardId', controller.cardGet);
router.delete('/:cardId', controller.cardDelete);

module.exports = router;