const express = require('express');

const router = express.Router();
const userController = require('../controller/userController');

router
  .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
  
router
  .route('/:userId')
  .get(userController.getUserById)


module.exports = router;