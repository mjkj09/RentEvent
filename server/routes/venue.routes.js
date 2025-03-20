const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venue.controller');

router.get('/', venueController.getAllVenues);      // GET all venues
router.get('/:id', venueController.getVenueById);   // GET single venue by ID
router.post('/', venueController.createVenue);      // POST create new venue
router.put('/:id', venueController.updateVenue);    // PUT update venue
router.delete('/:id', venueController.deleteVenue); // DELETE venue

module.exports = router;