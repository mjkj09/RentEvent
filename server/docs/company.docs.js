/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         name:
 *           type: string
 *           example: Example Company Ltd.
 *         nip:
 *           type: string
 *           example: "1234567890"
 *           description: 10-digit Polish tax identification number
 *         regon:
 *           type: string
 *           example: "123456789"
 *           description: 9 or 14-digit Polish statistical number
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               example: 123 Main St
 *             city:
 *               type: string
 *               example: Krakow
 *             region:
 *               type: string
 *               example: Malopolska
 *         owner:
 *           type: string
 *           example: 60d21b4667d0d8992e610c86
 *           description: User ID of the company owner
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/v1/company:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     description: Create a new company for the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - nip
 *               - regon
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Example Company Ltd.
 *               nip:
 *                 type: string
 *                 pattern: ^\d{10}$
 *                 example: "1234567890"
 *                 description: 10-digit Polish tax identification number
 *               regon:
 *                 type: string
 *                 pattern: ^\d{9}$|^\d{14}$
 *                 example: "123456789"
 *                 description: 9 or 14-digit Polish statistical number
 *               address:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - region
 *                 properties:
 *                   street:
 *                     type: string
 *                     minLength: 5
 *                     maxLength: 100
 *                     example: 123 Main St
 *                   city:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 50
 *                     example: Krakow
 *                   region:
 *                     type: string
 *                     enum: [
 *                       'Malopolska',
 *                       'Mazowieckie',
 *                       'Dolnoslaskie',
 *                       'Pomorskie',
 *                       'Wielkopolskie',
 *                       'Slaskie',
 *                       'Lubelskie',
 *                       'Podlaskie',
 *                       'Zachodniopomorskie',
 *                       'Lubuskie',
 *                       'Kujawsko-Pomorskie',
 *                       'Lodzkie',
 *                       'Swietokrzyskie',
 *                       'Podkarpackie',
 *                       'Warminsko-Mazurskie'
 *                     ]
 *                     example: Malopolska
 *     responses:
 *       201:
 *         description: Company created successfully
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
 *                   example: Company created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad request - validation error or user already has company
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
 *                       example: User already has a company registered
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Conflict - company with this NIP already exists
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
 *                       example: Company with this NIP already exists
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/company/my-company:
 *   get:
 *     summary: Get authenticated user's company
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieve the company owned by the authenticated user
 *     responses:
 *       200:
 *         description: Company retrieved successfully
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
 *                   example: Company retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Company not found
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
 *                       example: Company not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   put:
 *     summary: Update authenticated user's company
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     description: Update the company owned by the authenticated user
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
 *                 maxLength: 100
 *                 example: Updated Company Name
 *               nip:
 *                 type: string
 *                 pattern: ^\d{10}$
 *                 example: "9876543210"
 *               regon:
 *                 type: string
 *                 pattern: ^\d{9}$|^\d{14}$
 *                 example: "987654321"
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     minLength: 5
 *                     maxLength: 100
 *                     example: 456 New St
 *                   city:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 50
 *                     example: Warsaw
 *                   region:
 *                     type: string
 *                     enum: [
 *                       'Malopolska',
 *                       'Mazowieckie',
 *                       'Dolnoslaskie',
 *                       'Pomorskie',
 *                       'Wielkopolskie',
 *                       'Slaskie',
 *                       'Lubelskie',
 *                       'Podlaskie',
 *                       'Zachodniopomorskie',
 *                       'Lubuskie',
 *                       'Kujawsko-Pomorskie',
 *                       'Lodzkie',
 *                       'Swietokrzyskie',
 *                       'Podkarpackie',
 *                       'Warminsko-Mazurskie'
 *                     ]
 *                     example: Mazowieckie
 *     responses:
 *       200:
 *         description: Company updated successfully
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
 *                   example: Company updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Conflict - company with this NIP already exists
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
 *                       example: Company with this NIP already exists
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   delete:
 *     summary: Delete authenticated user's company
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     description: Delete the company owned by the authenticated user and switch user role to renter
 *     responses:
 *       200:
 *         description: Company deleted successfully
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
 *                   example: Company deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/company/switch-to-renter:
 *   post:
 *     summary: Switch user role to renter
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     description: Switch the authenticated user's role from owner to renter
 *     responses:
 *       200:
 *         description: Role switched successfully
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
 *                   example: User role switched to renter successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: User not found
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
 *                       example: User not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/company/check-exists:
 *   get:
 *     summary: Check if user has a company
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     description: Check if the authenticated user already has a company
 *     responses:
 *       200:
 *         description: Company existence checked
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
 *                   example: Company existence checked
 *                 data:
 *                   type: object
 *                   properties:
 *                     exists:
 *                       type: boolean
 *                       example: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/company/all:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieve a list of all companies (admin role required)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
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
 *                   example: Companies retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     companies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Company'
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - admin role required
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
 *                       example: Access denied. Not authorized.
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/company/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieve a company by its ID (admin role required)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *         example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: Company retrieved successfully
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
 *                   example: Company retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - admin role required
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
 *                       example: Access denied. Not authorized.
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */