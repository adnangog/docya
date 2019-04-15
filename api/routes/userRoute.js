const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController')

router.post('/', controller.userList);
router.post('/add', controller.userAdd);
router.post('/update/:userId', controller.userUpdateInfo);
router.post('/login', controller.userLogin);
router.patch('/:userId', controller.userUpdate);
router.get('/:userId', controller.userGet);
router.get('/delete/:userId', controller.userDelete);
router.post('/document/add', controller.userDocumentAdd);
router.post('/authset/:authsetId', controller.userByAuthSetId);

router.post('/v2/', controller.userList_);
router.post('/v2/login', controller.userLogin_);
router.get('/v2/:userId', controller.userGet_);
router.patch('/v2/:userId', controller.userUpdate);
router.post('/v2/add', controller.userAdd);

module.exports = router;