const express = require('express');
const router = express.Router();
const controller = require('../controllers/searchController')

router.post('/', controller.searchList);
router.post('/add', controller.searchAdd);
router.patch('/:searchId', controller.searchUpdate);
router.get('/:searchId', controller.searchGet);
router.get('/delete/:searchId', controller.searchDelete);

module.exports = router;