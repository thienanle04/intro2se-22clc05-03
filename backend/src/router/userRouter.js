const express = require('express');
const authenticateToken = require('../middleware/verifyToken');

const router = express.Router();
const userController = require('../controller/userController.js');

router
  .route('/')
    .get(authenticateToken, userController.getAllUsers)
  
router
  .route('/:userId')
  .get(authenticateToken, userController.getUserById)

module.exports = router;