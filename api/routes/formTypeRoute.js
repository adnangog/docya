const express = require('express');
const router = express.Router();
const controller = require('../controllers/formTypeController')

router.post('/', controller.formTypeList);
router.post('/add', controller.formTypeAdd);
router.patch('/:formTypeId', controller.formTypeUpdate);
router.get('/:formTypeId', controller.formTypeGet);
router.get('/delete/:formTypeId', controller.formTypeDelete);

module.exports = router;