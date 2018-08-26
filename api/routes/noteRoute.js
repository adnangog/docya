const express = require('express');
const router = express.Router();
const controller = require('../controllers/noteController')

router.post('/', controller.noteList);
router.post('/add', controller.noteAdd);
router.patch('/:noteId', controller.noteUpdate);
router.get('/:noteId', controller.noteGet);
router.get('/delete/:noteId', controller.noteDelete);

module.exports = router;