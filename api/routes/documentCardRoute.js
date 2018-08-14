const express = require('express');
const router = express.Router();
const controller = require('../controllers/documentCardController')

router.post('/', controller.documentcardList);
router.post('/add', controller.documentcardAdd);
router.patch('/:cardId', controller.documentcardUpdate);
router.get('/:cardId', controller.documentcardGet);
router.delete('/:cardId', controller.documentcardDelete);

module.exports = router;