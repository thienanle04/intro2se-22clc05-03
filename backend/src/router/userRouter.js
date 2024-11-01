const express = require('express');
const Authentication = require('../middleware/verifyToken');

const router = express.Router();
const userController = require('../controller/userController.js');


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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// [GET] /api/user: get all users, only admin can access
router
  .route('')
  .get(Authentication.authenticateToken, Authentication.isAdmin, userController.getAllUsers)

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
// [DELETE] /api/user/userId/delete: delete user by userId, only admin can access
router
  .route('/:userId/delete')
  .delete(Authentication.authenticateToken, Authentication.isAdmin, userController.deleteUser)


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
*       404:
*         description: User not found.
*/
// [GET] /api/user/userId: get user by userId, only this user can access
router
  .route('/:userId')
  .get(Authentication.authenticateToken, Authentication.reCheckUser, userController.getUserById)


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
*       404:
*         description: User not found.
*/
// [PATCH] /api/user/update: update user profile, only this user can access
router
  .route('/:userId/update')
  .patch(Authentication.authenticateToken, Authentication.reCheckUser, userController.updateMyProfile)



module.exports = router;