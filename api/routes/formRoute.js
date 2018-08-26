const express = require('express');
const router = express.Router();
const controller = require('../controllers/formController')

router.post('/', controller.formList);
router.post('/add', controller.formAdd);
router.patch('/:formId', controller.formUpdate);
router.get('/:formId', controller.formGet);
router.get('/delete/:formId', controller.formDelete);

module.exports = router;