const express = require('express');
const router = express.Router();
const controller = require('../controllers/flowTemplateController')

router.post('/', controller.flowTemplateList);
router.post('/add', controller.flowTemplateAdd);
router.patch('/:flowTemplateId', controller.flowTemplateUpdate);
router.get('/:flowTemplateId', controller.flowTemplateGet);
router.get('/delete/:flowTemplateId', controller.flowTemplateDelete);

module.exports = router;