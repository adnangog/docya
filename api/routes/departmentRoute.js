const express = require('express');
const router = express.Router();
const controller = require('../controlllers/departmentController')

router.post('/',controller.departmentList);
router.post('/add', controller.departmentAdd);
router.patch('/:departmentId', controller.departmentUpdate);
router.get('/:departmentId', controller.departmentGet);
router.delete('/:departmentId', controller.departmentDelete);

module.exports = router;