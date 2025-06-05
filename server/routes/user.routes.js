const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');

// WAŻNE: Specyficzne route'y PRZED parametryzowanymi!
router.get('/profile', verifyToken, ctrl.getUserProfile);
router.put('/profile', verifyToken, ctrl.updateProfile);
router.delete('/account', verifyToken, ctrl.deleteAccount);

// Pozostałe route'y
router.get('/', ctrl.getAllUsers);
router.post('/', ctrl.createUser);

// Parametryzowane route'y na końcu
router.get('/:id', ctrl.getUserById);
router.put('/:id', ctrl.updateUser);
router.delete('/:id', ctrl.deleteUser);

router.get('/:id/favorites', verifyToken, ctrl.getFavorites);
router.post('/:id/favorites', verifyToken, ctrl.addFavorite);
router.delete('/:id/favorites/:venueId', verifyToken, ctrl.removeFavorite);

module.exports = router;