const express = require('express');
const Authentication = require('../middleware/verifyToken');
const router = express.Router();
const userController = require('../controller/userController.js');
const upload = require('../config/cloudinary.config.js');

// [GET] /api/v1/users: get all users, only admin can access
router
  .route('')
  .get(Authentication.authenticateToken, 
    Authentication.isAdmin, userController.getAllUsers
  );

// [POST] /api/v1/users/create: create user, only admin can access
router
  .route('/create')
  .post(Authentication.authenticateToken, 
    Authentication.isAdmin, upload.single('image'), 
    userController.createUser
  );

// [GET] /api/v1/users/{userId}: get user by userId, only this user or admin can access
router
  .route('/:userId')
  .get(Authentication.authenticateToken, 
    Authentication.reCheckUser, userController.getUserById
  );

// [PATCH] /api/v1/users/{userId}/update: update user profile, only this user or admin can access
router
  .route('/:userId/update')
  .patch(
    Authentication.authenticateToken, 
    Authentication.reCheckUser,
    upload.single('image'), 
    userController.updateMyProfile
  );

// [DELETE] /api/v1/users/{userId}/delete: delete user by userId, only admin can access
router
  .route('/:userId/delete')
  .delete(Authentication.authenticateToken, 
    Authentication.isAdmin, 
    userController.deleteUser
  );

router
  .route('/:userId/cart')
  .get(Authentication.authenticateToken, 
    Authentication.reCheckUser, 
    userController.getCart
  );

// [POST] /api/v1/users/{userId}/addCart
router
  .route('/:userId/addCart')
  .post(Authentication.authenticateToken, 
    Authentication.reCheckUser, 
    userController.addCart
  );

// [POST] /api/v1/users/{userId}/removeCart
router
  .route('/:userId/removeCart')
  .post(Authentication.authenticateToken, 
    Authentication.reCheckUser, 
    userController.removeCart
  );

router
  .route('/:userId/removeCart/:bookId')
  .post(Authentication.authenticateToken, 
    Authentication.reCheckUser,
    userController.removeCartItem
  );

// [POST] /api/v1/users/{userId}/payment
router
  .route('/:userId/payment')
  .post(
    // Authentication.authenticateToken, 
    // Authentication.reCheckUser, 
    userController.payment
  );


module.exports = router;
