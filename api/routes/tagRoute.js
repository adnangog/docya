const express = require('express');
const router = express.Router();
const controller = require('../controllers/tagController')

router.post('/', controller.tagList);
router.post('/add', controller.tagAdd);
router.patch('/:tagId', controller.tagUpdate);
router.get('/:tagId', controller.tagGet);
router.get('/delete/:tagId', controller.tagDelete);

module.exports = router;