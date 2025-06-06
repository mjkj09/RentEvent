
/**
 * @swagger
 * components:
 *   schemas:
 *     Venue:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - location
 *         - owner
 *         - company
 *         - capacity
 *       properties:
 *         _id:
 *           type: string
 *           format: objectid
 *           example: "60d21b4667d0d8992e610c85"
 *         name:
 *           type: string
 *           example: "Grand Ballroom"
 *         category:
 *           type: string
 *           enum: [
 *             'Wedding & Banquet Halls',
 *             'Conference & Meeting Rooms',
 *             'Outdoor & Garden Spaces',
 *             'Clubs & Bars',
 *             'Lofts & Industrial Venues',
 *             'Unique & Themed Spaces'
 *           ]
 *           example: "Wedding & Banquet Halls"
 *         location:
 *           type: object
 *           required:
 *             - street
 *             - city
 *             - region
 *           properties:
 *             street:
 *               type: string
 *               example: "ul. Krakowska 123"
 *             city:
 *               type: string
 *               example: "Krakow"
 *             region:
 *               type: string
 *               enum: [
 *                 'Malopolska',
 *                 'Mazowieckie',
 *                 'Dolnoslaskie',
 *                 'Pomorskie',
 *                 'Wielkopolskie',
 *                 'Slaskie',
 *                 'Lubelskie',
 *                 'Podlaskie',
 *                 'Zachodniopomorskie',
 *                 'Lubuskie',
 *                 'Kujawsko-Pomorskie',
 *                 'Lodzkie',
 *                 'Swietokrzyskie',
 *                 'Podkarpackie',
 *                 'Warminsko-Mazurskie'
 *               ]
 *               example: "Malopolska"
 *         owner:
 *           oneOf:
 *             - type: string
 *               format: objectid
 *               example: "60d21b4667d0d8992e610c86"
 *             - type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   format: objectid
 *                 name:
 *                   type: string
 *                 surname:
 *                   type: string
 *                 phone:
 *                   type: string
 *         company:
 *           oneOf:
 *             - type: string
 *               format: objectid
 *               example: "60d21b4667d0d8992e610c87"
 *             - type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   format: objectid
 *                 name:
 *                   type: string
 *         description:
 *           type: string
 *           default: ""
 *           example: "A beautiful venue for your special day"
 *         capacity:
 *           type: number
 *           minimum: 1
 *           example: 200
 *         pricing:
 *           type: object
 *           properties:
 *             minPricePerPerson:
 *               type: number
 *               minimum: 0
 *               nullable: true
 *               default: null
 *               example: 100
 *             maxPricePerPerson:
 *               type: number
 *               minimum: 0
 *               nullable: true
 *               default: null
 *               example: 200
 *             isPriceHidden:
 *               type: boolean
 *               default: false
 *               example: false
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["/uploads/venues/image1.jpg", "/uploads/venues/image2.jpg"]
 *         bannerImage:
 *           type: string
 *           nullable: true
 *           default: null
 *           example: "/uploads/venues/banner.jpg"
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           default: 0
 *           example: 4.5
 *         reviews:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 25
 *         isActive:
 *           type: boolean
 *           default: true
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-06-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-06-01T10:00:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: Venues
 *   description: Venue management endpoints
 */

/**
 * @swagger
 * /api/v1/venues:
 *   get:
 *     summary: Get all venues
 *     tags: [Venues]
 *     description: Retrieve a list of all active venues with optional filtering and searching
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in venue name, description, city, or region
 *         example: "wedding"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [
 *             'Wedding & Banquet Halls',
 *             'Conference & Meeting Rooms',
 *             'Outdoor & Garden Spaces',
 *             'Clubs & Bars',
 *             'Lofts & Industrial Venues',
 *             'Unique & Themed Spaces'
 *           ]
 *         description: Filter venues by single category
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Filter venues by multiple categories (comma-separated)
 *         example: "Wedding & Banquet Halls,Conference & Meeting Rooms"
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *           enum: [
 *             'Malopolska',
 *             'Mazowieckie',
 *             'Dolnoslaskie',
 *             'Pomorskie',
 *             'Wielkopolskie',
 *             'Slaskie',
 *             'Lubelskie',
 *             'Podlaskie',
 *             'Zachodniopomorskie',
 *             'Lubuskie',
 *             'Kujawsko-Pomorskie',
 *             'Lodzkie',
 *             'Swietokrzyskie',
 *             'Podkarpackie',
 *             'Warminsko-Mazurskie',
 *             'All Poland'
 *           ]
 *         description: Filter venues by region
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price per person
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price per person
 *       - in: query
 *         name: minCapacity
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Minimum venue capacity
 *       - in: query
 *         name: maxCapacity
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum venue capacity
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         description: Minimum venue rating
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price-low, price-high, rating, reviews, newest]
 *           default: newest
 *         description: Sort venues by specified criteria
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of venues per page
 *     responses:
 *       200:
 *         description: Venues retrieved successfully
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
 *                   example: "Venues retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venue'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   post:
 *     summary: Create a new venue
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new venue (requires owner role and registered company)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - location
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Grand Ballroom"
 *               category:
 *                 type: string
 *                 enum: [
 *                   'Wedding & Banquet Halls',
 *                   'Conference & Meeting Rooms',
 *                   'Outdoor & Garden Spaces',
 *                   'Clubs & Bars',
 *                   'Lofts & Industrial Venues',
 *                   'Unique & Themed Spaces'
 *                 ]
 *                 example: "Wedding & Banquet Halls"
 *               location:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - region
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "ul. Krakowska 123"
 *                   city:
 *                     type: string
 *                     example: "Krakow"
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
 *                     example: "Malopolska"
 *               description:
 *                 type: string
 *                 example: "A beautiful venue for your special day"
 *               capacity:
 *                 type: number
 *                 minimum: 1
 *                 example: 200
 *               pricing:
 *                 type: object
 *                 properties:
 *                   minPricePerPerson:
 *                     type: number
 *                     minimum: 0
 *                     nullable: true
 *                     example: 100
 *                   maxPricePerPerson:
 *                     type: number
 *                     minimum: 0
 *                     nullable: true
 *                     example: 200
 *                   isPriceHidden:
 *                     type: boolean
 *                     default: false
 *                     example: false
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["/uploads/venues/image1.jpg", "/uploads/venues/image2.jpg"]
 *               bannerImage:
 *                 type: string
 *                 nullable: true
 *                 example: "/uploads/venues/banner.jpg"
 *     responses:
 *       201:
 *         description: Venue created successfully
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
 *                   example: "Venue created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Venue'
 *       400:
 *         description: Bad request or owner must have a registered company
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
 *                       example: "Owner must have a registered company to create venues"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - requires owner role
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
 *                       example: "Access denied. Required role: owner"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/venues/{id}:
 *   get:
 *     summary: Get a venue by ID
 *     tags: [Venues]
 *     description: Retrieve a basic venue by its ID with populated owner and company info
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *         description: Venue ID
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Venue retrieved successfully
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
 *                   example: "Venue retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Venue'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   put:
 *     summary: Update a venue
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     description: Update a venue by its ID (requires owner or admin role)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *         description: Venue ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Grand Ballroom"
 *               category:
 *                 type: string
 *                 enum: [
 *                   'Wedding & Banquet Halls',
 *                   'Conference & Meeting Rooms',
 *                   'Outdoor & Garden Spaces',
 *                   'Clubs & Bars',
 *                   'Lofts & Industrial Venues',
 *                   'Unique & Themed Spaces'
 *                 ]
 *               location:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
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
 *               description:
 *                 type: string
 *               capacity:
 *                 type: number
 *                 minimum: 1
 *               pricing:
 *                 type: object
 *                 properties:
 *                   minPricePerPerson:
 *                     type: number
 *                     minimum: 0
 *                     nullable: true
 *                   maxPricePerPerson:
 *                     type: number
 *                     minimum: 0
 *                     nullable: true
 *                   isPriceHidden:
 *                     type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               bannerImage:
 *                 type: string
 *                 nullable: true
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Venue updated successfully
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
 *                   example: "Venue updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Venue'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - requires owner or admin role
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   delete:
 *     summary: Delete a venue
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     description: Delete a venue by its ID (requires owner or admin role)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *         description: Venue ID
 *     responses:
 *       200:
 *         description: Venue deleted successfully
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
 *                   example: "Venue deleted successfully"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - requires owner or admin role
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/venues/{id}/details:
 *   get:
 *     summary: Get detailed venue information
 *     tags: [Venues]
 *     description: Retrieve detailed information about a venue including reviews, rating stats, and owner company info
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *         description: Venue ID
 *     responses:
 *       200:
 *         description: Venue details retrieved successfully
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
 *                   example: "Venue details retrieved successfully"
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Venue'
 *                     - type: object
 *                       properties:
 *                         reviews:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               user:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                   surname:
 *                                     type: string
 *                                   email:
 *                                     type: string
 *                               rating:
 *                                 type: number
 *                                 minimum: 1
 *                                 maximum: 5
 *                               comment:
 *                                 type: string
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                         ratingStats:
 *                           type: object
 *                           properties:
 *                             averageRating:
 *                               type: number
 *                               minimum: 0
 *                               maximum: 5
 *                               example: 4.5
 *                             totalReviews:
 *                               type: number
 *                               minimum: 0
 *                               example: 25
 *                             ratingDistribution:
 *                               type: object
 *                               properties:
 *                                 "1":
 *                                   type: number
 *                                   example: 1
 *                                 "2":
 *                                   type: number
 *                                   example: 2
 *                                 "3":
 *                                   type: number
 *                                   example: 3
 *                                 "4":
 *                                   type: number
 *                                   example: 8
 *                                 "5":
 *                                   type: number
 *                                   example: 11
 *                         ownerCompany:
 *                           type: object
 *                           nullable: true
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "Event Solutions Sp. z o.o."
 *                             contactEmail:
 *                               type: string
 *                               example: "contact@eventsolutions.pl"
 *                             contactPhone:
 *                               type: string
 *                               example: "+48 123 456 789"
 *                             website:
 *                               type: string
 *                               example: "https://eventsolutions.pl"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/venues/stats/categories:
 *   get:
 *     summary: Get venue category statistics
 *     tags: [Venues]
 *     description: Retrieve statistics about active venue categories
 *     responses:
 *       200:
 *         description: Category statistics retrieved successfully
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
 *                   example: "Category statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   example:
 *                     "Wedding & Banquet Halls": 25
 *                     "Conference & Meeting Rooms": 18
 *                     "Outdoor & Garden Spaces": 12
 *                     "Clubs & Bars": 8
 *                     "Lofts & Industrial Venues": 5
 *                     "Unique & Themed Spaces": 3
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/venues/popular:
 *   get:
 *     summary: Get popular venues
 *     tags: [Venues]
 *     description: Retrieve a list of popular venues based on reviews and ratings
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 6
 *         description: Number of venues to return
 *     responses:
 *       200:
 *         description: Popular venues retrieved successfully
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
 *                   example: "Popular venues retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Venue'
 *                       - type: object
 *                         properties:
 *                           ratingStats:
 *                             type: object
 *                             properties:
 *                               averageRating:
 *                                 type: number
 *                                 minimum: 0
 *                                 maximum: 5
 *                               totalReviews:
 *                                 type: number
 *                                 minimum: 0
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/venues/my/venues:
 *   get:
 *     summary: Get venues owned by the authenticated user
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a list of venues owned by the authenticated user (requires owner role)
 *     responses:
 *       200:
 *         description: Your venues retrieved successfully
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
 *                   example: "Your venues retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Venue'
 *                       - type: object
 *                         properties:
 *                           ratingStats:
 *                             type: object
 *                             properties:
 *                               averageRating:
 *                                 type: number
 *                                 minimum: 0
 *                                 maximum: 5
 *                               totalReviews:
 *                                 type: number
 *                                 minimum: 0
 *                               ratingDistribution:
 *                                 type: object
 *                                 properties:
 *                                   "1":
 *                                     type: number
 *                                   "2":
 *                                     type: number
 *                                   "3":
 *                                     type: number
 *                                   "4":
 *                                     type: number
 *                                   "5":
 *                                     type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - requires owner role
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/venues/{id}/toggle-active:
 *   patch:
 *     summary: Toggle venue active status
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     description: Toggle the active status of a venue (only venue owner can perform this action)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *         description: Venue ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: Set venue as active (true) or inactive (false)
 *     responses:
 *       200:
 *         description: Venue status toggled successfully
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
 *                   example: "Venue activated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Venue'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - only venue owner can toggle status
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
 *                       example: "Unauthorized - you can only manage your own venues"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/venues/upload-image:
 *   post:
 *     summary: Upload a venue image
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     description: Upload an image for a venue (requires owner role). Returns full URL for the uploaded image.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload (JPEG, PNG, etc.)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
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
 *                   example: "Image uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *                       example: "http://localhost:5000/uploads/venues/image-1234567890.jpg"
 *                       description: Full URL to the uploaded image
 *       400:
 *         description: No image file provided
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
 *                       example: "No image file provided"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden - requires owner role
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
 *                       example: "Access denied. Required role: owner"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */