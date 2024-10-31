const express = require('express');
const Authentication = require('../middleware/verifyToken');

const router = express.Router();
const userController = require('../controller/userController.js');

// [GET] /api/user: get all users, only admin can access
router
  .route('')
  .get(Authentication.authenticateToken, Authentication.isAdmin, userController.getAllUsers)

// [DELETE] /api/user/userId/delete: delete user by userId, only admin can access
router
  .route('/:userId/delete')
  .delete(Authentication.authenticateToken, Authentication.isAdmin, userController.deleteUser)

// [GET] /api/user/userId: get user by userId, only this user can access
router
  .route('/:userId')
  .get(Authentication.authenticateToken, Authentication.reCheckUser, userController.getUserById)

// [PATCH] /api/user/update: update user profile, only this user can access
router
  .route('/:userId/update')
  .patch(Authentication.authenticateToken, Authentication.reCheckUser, userController.updateMyProfile)



module.exports = router;