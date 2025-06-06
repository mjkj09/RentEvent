/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: Get the profile of the currently authenticated user
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 60d21b4667d0d8992e610c85
 *                         name:
 *                           type: string
 *                           example: John
 *                         surname:
 *                           type: string
 *                           example: Doe
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: john.doe@example.com
 *                         phone:
 *                           type: string
 *                           example: +48123456789
 *                         role:
 *                           type: string
 *                           enum: [admin, owner, renter]
 *                           example: renter
 *                     company:
 *                       type: object
 *                       nullable: true
 *                       description: Company information (only for owners)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: Update the profile of the currently authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               phone:
 *                 type: string
 *                 example: +48123456789
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Required only when changing password
 *                 example: currentPassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: New password (requires currentPassword)
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/users/account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: Delete the account of the currently authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Current password for verification
 *                 example: password123
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Account deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/users/favorites:
 *   get:
 *     summary: Get user favorites
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: Get the favorite venues of the currently authenticated user
 *     responses:
 *       200:
 *         description: Favorite venues retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Favorite venues retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venue'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   post:
 *     summary: Add a venue to favorites
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: Add a venue to the favorites of the currently authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - venueId
 *             properties:
 *               venueId:
 *                 type: string
 *                 description: ID of the venue to add to favorites
 *                 example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: Venue added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Venue added to favorites
 *                 data:
 *                   type: object
 *                   description: Updated user object
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/users/favorites/{venueId}:
 *   delete:
 *     summary: Remove a venue from favorites
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: Remove a venue from the favorites of the currently authenticated user
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Venue ID to remove from favorites
 *         example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: Venue removed from favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Venue removed from favorites
 *                 data:
 *                   type: object
 *                   description: Updated user object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/users/favorites/{venueId}/check:
 *   get:
 *     summary: Check if a venue is in favorites
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: Check if a venue is in the favorites of the currently authenticated user
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Venue ID to check
 *         example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: Favorite status checked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Favorite status checked
 *                 data:
 *                   type: object
 *                   properties:
 *                     isFavorite:
 *                       type: boolean
 *                       example: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieve a list of all users (admin role required)
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: Create a new user (admin role required)
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
 *               - role
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
 *               phone:
 *                 type: string
 *                 example: +48123456789
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [admin, owner, renter]
 *                 example: renter
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: User created successfully.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Error'
 *       409:
 *         description: Conflict - email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieve a user by their ID (admin role required)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Error'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: Update a user by their ID (admin role required)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 60d21b4667d0d8992e610c85
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               phone:
 *                 type: string
 *                 example: +48123456789
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: newpassword123
 *               role:
 *                 type: string
 *                 enum: [admin, owner, renter]
 *                 example: renter
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: User updated successfully.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Error'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Conflict - email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: Delete a user by their ID (admin role required)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 60d21b4667d0d8992e610c85
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Error'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */