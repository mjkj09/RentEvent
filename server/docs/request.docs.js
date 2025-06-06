/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Venue inquiry and request management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         venue:
 *           type: string
 *           example: 60d21b4667d0d8992e610c86
 *           description: Reference to Venue ID
 *         sender:
 *           type: string
 *           example: 60d21b4667d0d8992e610c87
 *           description: Reference to User ID (sender)
 *         receiver:
 *           type: string
 *           example: 60d21b4667d0d8992e610c88
 *           description: Reference to User ID (receiver/venue owner)
 *         senderName:
 *           type: string
 *           example: John Doe
 *         senderEmail:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         senderPhone:
 *           type: string
 *           example: +48123456789
 *         eventDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2023-12-31T18:00:00.000Z
 *         eventType:
 *           type: string
 *           enum: [Wedding, Corporate Event, Birthday Party, Anniversary, Conference, Workshop, Product Launch, Networking Event, Social Gathering, Other]
 *           example: Wedding
 *         expectedGuestCount:
 *           type: number
 *           minimum: 1
 *           example: 100
 *         message:
 *           type: string
 *           example: I'm interested in booking your venue for my wedding. Please provide more information about availability and pricing.
 *         status:
 *           type: string
 *           enum: [pending, responded, cancelled]
 *           example: pending
 *         emailSent:
 *           type: boolean
 *           example: true
 *           description: Whether notification email was sent
 *         emailSentAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2023-01-01T00:00:00.000Z
 *         emailError:
 *           type: string
 *           nullable: true
 *           example: null
 *           description: Email sending error if any
 *         isReadByReceiver:
 *           type: boolean
 *           example: false
 *         readAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         deletedBySender:
 *           type: boolean
 *           example: false
 *           description: Soft delete flag for sender
 *         deletedByReceiver:
 *           type: boolean
 *           example: false
 *           description: Soft delete flag for receiver
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
 * /api/v1/requests:
 *   post:
 *     summary: Create a new venue inquiry
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     description: Send a new inquiry about a venue
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - venue
 *               - senderName
 *               - senderEmail
 *               - senderPhone
 *               - eventType
 *               - expectedGuestCount
 *               - message
 *             properties:
 *               venue:
 *                 type: string
 *                 description: ID of the venue
 *                 example: 60d21b4667d0d8992e610c86
 *               senderName:
 *                 type: string
 *                 example: John Doe
 *               senderEmail:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               senderPhone:
 *                 type: string
 *                 example: +48123456789
 *                 description: Required - can be provided in request or taken from user profile
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: 2023-12-31T18:00:00.000Z
 *                 description: Optional event date
 *               eventType:
 *                 type: string
 *                 enum: [Wedding, Corporate Event, Birthday Party, Anniversary, Conference, Workshop, Product Launch, Networking Event, Social Gathering, Other]
 *                 example: Wedding
 *               expectedGuestCount:
 *                 type: number
 *                 minimum: 1
 *                 example: 100
 *                 description: Must not exceed venue capacity
 *               message:
 *                 type: string
 *                 example: I'm interested in booking your venue for my wedding. Please provide more information about availability and pricing.
 *     responses:
 *       201:
 *         description: Venue inquiry sent successfully
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
 *                   example: Venue inquiry sent successfully
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       400:
 *         description: Bad request - validation error or guest count exceeds venue capacity
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
 *                       example: Guest count (150) exceeds venue capacity (100)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Venue not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/requests/sent:
 *   get:
 *     summary: Get user's sent requests
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieve a list of requests sent by the authenticated user
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, responded, cancelled]
 *         description: Filter requests by status
 *     responses:
 *       200:
 *         description: Sent requests retrieved successfully
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
 *                   example: Sent requests retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     requests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Request'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 25
 *                         pages:
 *                           type: integer
 *                           example: 3
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/requests/received:
 *   get:
 *     summary: Get user's received requests
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieve a list of requests received by the authenticated user
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, responded, cancelled]
 *         description: Filter requests by status
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Filter to show only unread requests
 *     responses:
 *       200:
 *         description: Received requests retrieved successfully
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
 *                   example: Received requests retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     requests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Request'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 25
 *                         pages:
 *                           type: integer
 *                           example: 3
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/requests/unread-count:
 *   get:
 *     summary: Get unread requests count
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     description: Get the count of unread requests for the authenticated user
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
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
 *                   example: Unread count retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     unreadCount:
 *                       type: integer
 *                       example: 5
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/requests/mark-all-read:
 *   patch:
 *     summary: Mark all requests as read
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     description: Mark all received requests as read for the authenticated user
 *     responses:
 *       200:
 *         description: All requests marked as read
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
 *                   example: All requests marked as read
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/requests/{id}:
 *   get:
 *     summary: Get a request by ID
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieve a specific request by its ID (user must be sender or receiver)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *         example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: Request retrieved successfully
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
 *                   example: Request retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - user is not the sender or receiver
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
 *                       example: Unauthorized to view this request
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   delete:
 *     summary: Delete a request (soft delete)
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     description: Soft delete a request by its ID (user must be sender or receiver)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *         example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: Request deleted successfully
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
 *                   example: Request deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - user is not the sender or receiver
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
 *                       example: Unauthorized to delete this request
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/requests/{id}/mark-read:
 *   patch:
 *     summary: Mark a request as read
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     description: Mark a specific request as read (user must be the receiver)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *         example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: Request marked as read
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
 *                   example: Request marked as read
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - user is not the receiver
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
 *                       example: Unauthorized to mark this request as read
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/requests/{id}/status:
 *   patch:
 *     summary: Update request status
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     description: Update the status of a request (user must be sender or receiver with specific permissions)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *         example: 60d21b4667d0d8992e610c85
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, responded, cancelled]
 *                 example: responded
 *                 description: |
 *                   Status updates:
 *                   - 'cancelled': Only sender can cancel
 *                   - 'responded': Only receiver can mark as responded
 *                   - 'pending': Can be set by either sender or receiver
 *     responses:
 *       200:
 *         description: Request status updated successfully
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
 *                   example: Request marked as responded
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       400:
 *         description: Bad request - invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - user doesn't have permission for this status change
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
 *                       example: Only sender can cancel a request
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */