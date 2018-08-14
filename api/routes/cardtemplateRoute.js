const express = require('express');
const router = express.Router();
const controller = require('../controllers/cardtemplateController')

router.post('/', controller.cardtemplateList);
router.post('/add', controller.cardtemplateAdd);
router.patch('/:cardtemplateId', controller.cardtemplateUpdate);
router.get('/:cardtemplateId', controller.cardtemplateGet);
router.delete('/:cardtemplateId', controller.cardtemplateDelete);

module.exports = router;