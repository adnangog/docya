const express = require('express');
const router = express.Router();
const controller = require('../controllers/flowController')

router.post('/', controller.flowList);
router.post('/add', controller.flowAdd);
router.patch('/:flowId', controller.flowUpdate);
router.get('/:flowId', controller.flowGet);
router.get('/delete/:flowId', controller.flowDelete);

module.exports = router;