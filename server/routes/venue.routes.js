const router = require('express').Router();
const venueController = require('../controllers/venue.controller');

// CRUD
router.post('/', venueController.createVenue);
router.get('/', venueController.getAllVenues);
router.get('/:id', venueController.getVenueById);
router.put('/:id', venueController.updateVenue);
router.delete('/:id', venueController.deleteVenue);

module.exports = router;