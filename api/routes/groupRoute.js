const express = require('express');
const router = express.Router();
const controller = require('../controllers/groupController')

router.post('/', controller.groupList);
router.post('/add', controller.groupAdd);
router.patch('/:groupId', controller.groupUpdate);
router.get('/:groupId', controller.groupGet);
router.get('/delete/:groupId', controller.groupDelete);

module.exports = router;