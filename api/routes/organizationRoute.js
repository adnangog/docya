const express = require('express');
const router = express.Router();
const controller = require('../controllers/organizationController')

router.post('/',controller.organizationList);
router.post('/add', controller.organizationAdd);
router.patch('/:organizationId', controller.organizationUpdate);
router.get('/:organizationId', controller.organizationGet);
router.get('/delete/:organizationId', controller.organizationDelete);

module.exports = router;