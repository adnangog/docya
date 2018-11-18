const express = require('express');
const router = express.Router();
const controller = require('../controllers/listController')

router.post('/',controller.listList);
router.post('/add', controller.listAdd);
router.patch('/:listId', controller.listUpdate);
router.get('/:listId', controller.listGet);
router.get('/delete/:listId', controller.listDelete);

module.exports = router;