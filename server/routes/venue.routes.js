const router = require('express').Router();
const ctrl = require('../controllers/venue.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');

router.get('/', ctrl.getAllVenues);
router.get('/:id', ctrl.getVenueById);
router.post('/', verifyToken, hasRole(['owner']), ctrl.createVenue);

//TODO: Add additional logic to check if user is the owner of the venue
router.put('/:id', verifyToken, hasRole(['owner', 'admin']), ctrl.updateVenue);
router.delete('/:id', verifyToken, hasRole(['owner', 'admin']), ctrl.deleteVenue);

module.exports = router;
