const express = require('express');
const router = express.Router();
const controller = require('../controllers/classController')

router.post('/', controller.classList);
router.post('/add', controller.classAdd);
router.patch('/:classId', controller.classUpdate);
router.get('/:classId', controller.classGet);
router.get('/delete/:classId', controller.classDelete);

module.exports = router;