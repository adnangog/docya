const express = require('express');
const router = express.Router();
const controller = require('../controllers/authorityController')

router.post('/', controller.authorityList);
router.post('/add', controller.authorityAdd);
router.patch('/:authorityId', controller.authorityUpdate);
router.get('/:authorityId', controller.authorityGet);
router.delete('/:authorityId', controller.authorityDelete);
router.post('/set/', controller.authSetList);
router.post('/set/add', controller.authSetAdd);
router.patch('/set/:authSetId', controller.authSetUpdate);
router.get('/set/:authSetId', controller.authSetGet);
router.delete('/set/:authSetId', controller.authSetDelete);

module.exports = router;