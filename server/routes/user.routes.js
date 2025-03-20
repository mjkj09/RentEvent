const router = require('express').Router();
const userController = require('../controllers/user.controller');

// CRUD
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Favorites
router.get('/:id/favorites', userController.getFavorites);
router.post('/:id/favorites', userController.addFavorite);
router.delete('/:id/favorites/:venueId', userController.removeFavorite);

module.exports = router;
