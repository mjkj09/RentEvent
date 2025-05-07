const router = require('express').Router();
const ctrl = require('../controllers/venue.controller');

router.get('/', ctrl.getAllVenues);
router.get('/:id', ctrl.getVenueById);
router.post('/', ctrl.createVenue);
router.put('/:id', ctrl.updateVenue);
router.delete('/:id', ctrl.deleteVenue);

module.exports = router;
