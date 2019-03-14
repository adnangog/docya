const express = require('express');
const router = express.Router();
const controller = require('../controllers/cdnController')

router.get('/:fileName', controller.cdnGet);

module.exports = router;