const router = require('express').Router();
const ctrl = require('../controllers/venue.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');
const { uploadSingle } = require('../middleware/multer.middleware');

// Public routes
router.get('/', ctrl.getAllVenues);
router.get('/stats/categories', ctrl.getCategoryStats);
router.get('/popular', ctrl.getPopularVenues);
router.get('/:id', ctrl.getVenueById);
router.get('/:id/details', ctrl.getVenueDetails);
router.patch('/:id/toggle-active', verifyToken, ctrl.toggleVenueActive);

// Protected routes
router.post('/', verifyToken, hasRole(['owner']), ctrl.createVenue);

// Upload route with proper middleware order: auth first, then multer, then controller
router.post('/upload-image',
    verifyToken,
    hasRole(['owner']),
    uploadSingle('image'),
    ctrl.uploadImage
);

//TODO: Add additional logic to check if user is the owner of the venue
router.put('/:id', verifyToken, hasRole(['owner', 'admin']), ctrl.updateVenue);
router.delete('/:id', verifyToken, hasRole(['owner', 'admin']), ctrl.deleteVenue);

router.get('/my/venues', verifyToken, hasRole(['owner']), ctrl.getMyVenues);

module.exports = router;