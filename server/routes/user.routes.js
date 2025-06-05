const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');

// WAŻNE: Specyficzne route'y PRZED parametryzowanymi!
router.get('/profile', verifyToken, ctrl.getUserProfile);
router.put('/profile', verifyToken, ctrl.updateProfile);
router.delete('/account', verifyToken, ctrl.deleteAccount);

// Favorites routes - using current user from token
router.get('/favorites', verifyToken, ctrl.getFavorites);
router.post('/favorites', verifyToken, ctrl.addFavorite);
router.delete('/favorites/:venueId', verifyToken, ctrl.removeFavorite);
router.get('/favorites/:venueId/check', verifyToken, ctrl.checkFavorite);

// Pozostałe route'y
router.get('/', ctrl.getAllUsers);
router.post('/', ctrl.createUser);

// Parametryzowane route'y na końcu
router.get('/:id', ctrl.getUserById);
router.put('/:id', ctrl.updateUser);
router.delete('/:id', ctrl.deleteUser);

module.exports = router;