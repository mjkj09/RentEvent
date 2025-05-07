const router = require('express').Router();
const ctrl = require('../controllers/user.controller');

router.get('/', ctrl.getAllUsers);
router.get('/:id', ctrl.getUserById);
router.post('/', ctrl.createUser);
router.put('/:id', ctrl.updateUser);
router.delete('/:id', ctrl.deleteUser);

router.get('/:id/favorites', ctrl.getFavorites);
router.post('/:id/favorites', ctrl.addFavorite);
router.delete('/:id/favorites/:venueId', ctrl.removeFavorite);

module.exports = router;
