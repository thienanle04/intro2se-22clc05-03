const express = require('express');
const Authentication = require('../middleware/verifyToken');

const router = express.Router();
const userController = require('../controller/userController.js');

router
  .route('/')
  .get(Authentication.authenticateToken, Authentication.isAdmin, userController.getAllUsers)
  
router
  .route('/:userId')
  .get(Authentication.authenticateToken, userController.getUserById)

module.exports = router;