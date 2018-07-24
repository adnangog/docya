const express = require('express');
const router = express.Router();
const controller = require('../controlllers/authorityController')

router.post('/', controller.authorityList);
router.post('/add', controller.authorityAdd);
router.patch('/:authorityId', controller.authorityUpdate);
router.get('/:authorityId', controller.authorityGet);
router.delete('/:authorityId', controller.authorityDelete);

module.exports = router;