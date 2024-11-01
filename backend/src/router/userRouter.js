const express = require('express');
const Authentication = require('../middleware/verifyToken');
const router = express.Router();
const userController = require('../controller/userController.js');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         username:
 *           type: string
 *           description: Username of the user
 *         email:
 *           type: string
 *           description: User's email address
 *         role:
 *           type: string
 *           description: Role of the user (admin or user)
 *         address:
 *           type: string
 *           description: User's address
 *         phone:
 *           type: string
 *           description: User's phone number
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the user was created
 *       required:
 *         - id
 *         - username
 *         - email
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// [GET] /api/v1/users: get all users, only admin can access
router
  .route('')
  .get(Authentication.authenticateToken, Authentication.isAdmin, userController.getAllUsers);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 */
// [GET] /api/v1/users/{userId}: get user by userId, only this user or admin can access
router
  .route('/:userId')
  .get(Authentication.authenticateToken, Authentication.reCheckUser, userController.getUserById);

/**
 * @swagger
 * /api/v1/users/{userId}/update:
 *   patch:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 */
// [PATCH] /api/v1/users/{userId}/update: update user profile, only this user or admin can access
router
  .route('/:userId/update')
  .patch(Authentication.authenticateToken, Authentication.reCheckUser, userController.updateMyProfile);

/**
 * @swagger
 * /api/v1/users/{userId}/delete:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
// [DELETE] /api/v1/users/{userId}/delete: delete user by userId, only admin can access
router
  .route('/:userId/delete')
  .delete(Authentication.authenticateToken, Authentication.isAdmin, userController.deleteUser);

module.exports = router;
