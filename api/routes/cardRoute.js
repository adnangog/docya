const express = require('express');
const router = express.Router();
const controller = require('../controllers/cardController')

router.post('/', controller.cardList);
router.post('/add', controller.cardAdd);
router.patch('/:cardId', controller.cardUpdate);
router.get('/:cardId', controller.cardGet);
router.delete('/:cardId', controller.cardDelete);

module.exports = router;