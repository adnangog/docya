const express = require('express');
const router = express.Router();
const controller = require('../controlllers/cardtemplateController')

router.post('/', controller.cardtemplateList);
router.post('/add', controller.cardtemplateAdd);
router.patch('/:cardId', controller.cardtemplateUpdate);
router.get('/:cardId', controller.cardtemplateGet);
router.delete('/:cardId', controller.cardtemplateDelete);

module.exports = router;