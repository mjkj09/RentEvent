/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         name:
 *           type: string
 *           example: John
 *         surname:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         phone:
 *           type: string
 *           example: +48123456789
 *         role:
 *           type: string
 *           enum: [admin, owner, renter]
 *           example: renter
 *         favorites:
 *           type: array
 *           items:
 *             type: string
 *           example: ['60d21b4667d0d8992e610c86', '60d21b4667d0d8992e610c87']
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Register a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: John
 *               surname:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Must contain at least one uppercase letter, one lowercase letter, and one number
 *                 example: Password123
 *               role:
 *                 type: string
 *                 enum: [renter]
 *                 default: renter
 *                 example: renter
 *                 description: Only 'renter' role can be set during registration
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: John
 *                     surname:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     role:
 *                       type: string
 *                       example: renter
 *                 message:
 *                   type: string
 *                   example: Registration successful.
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Password must contain at least one uppercase letter, one lowercase letter, and one number
 *       409:
 *         description: Conflict - email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Email already in use
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     description: Authenticate a user and set HTTP-only cookies with tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: John
 *                     surname:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     role:
 *                       type: string
 *                       example: renter
 *                 message:
 *                   type: string
 *                   example: Logged in successfully.
 *       401:
 *         description: Unauthorized - invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Invalid credentials
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     description: Logout a user and clear authentication cookies
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     description: Get a new access token using refresh token from cookies
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: John
 *                     surname:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     role:
 *                       type: string
 *                       example: renter
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully.
 *       401:
 *         description: Unauthorized - invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Invalid or expired refresh token
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     description: Get information about the currently authenticated user
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: John
 *                     surname:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: john.doe@example.com
 *                     role:
 *                       type: string
 *                       enum: [admin, owner, renter]
 *                       example: renter
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */