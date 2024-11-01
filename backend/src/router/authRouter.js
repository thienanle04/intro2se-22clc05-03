const express = require('express');
const router = express.Router();
const authController = require('../controller/authController.js');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the new user
 *               password:
 *                 type: string
 *                 description: User's password
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Signup successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token for the new user
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   description: Signup success message
 *       400:
 *         description: Username already taken or invalid data
 *       500:
 *         description: Internal server error
 */
router
  .route('/signup')
  .post(authController.signup);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: JWT token for the user
 *                 message:
 *                   type: string
 *                   description: Login success message
 *       400:
 *         description: User not found or incorrect password
 *       500:
 *         description: Internal server error
 */
router
  .route('/login')
  .post(authController.login);

module.exports = router;
