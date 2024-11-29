const express = require('express');
const Authentication = require('../middleware/verifyToken');
const router = express.Router();
const userController = require('../controller/userController.js');

// [GET] /api/v1/users: get all users, only admin can access
router
  .route('')
  // .get(Authentication.authenticateToken, Authentication.isAdmin, userController.getAllUsers);
  .get(userController.getAllUsers);

// [POST] /api/v1/users: create new users, only admin can access
router 
  .route('/')
  // .get(Authentication.authenticateToken, Authentication.isAdmin, userController.createNewUser);
  .post(userController.createNewUser);

// [GET] /api/v1/users/{userId}: get user by userId, only this user or admin can access
router
  .route('/:userId')
  .get(Authentication.authenticateToken, Authentication.reCheckUser, userController.getUserById);

// [PATCH] /api/v1/users/{userId}/update: update user profile, only this user or admin can access
router
  .route('/:userId/update')
  .patch(Authentication.authenticateToken, Authentication.reCheckUser, userController.updateMyProfile);

// [DELETE] /api/v1/users/{userId}/delete: delete user by userId, only admin can access
router
  .route('/:userId/delete')
  .delete(Authentication.authenticateToken, Authentication.isAdmin, userController.deleteUser);

// [POST] /api/v1/users/{userId}/addCart
router
  .route('/:userId/addCart')
  .post(Authentication.authenticateToken, Authentication.reCheckUser, userController.addCart);
module.exports = router;
