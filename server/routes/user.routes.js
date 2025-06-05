const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { verifyToken, hasRole} = require('../middleware/auth.middleware');

//TODO: Add additional logic that user can only modify his own profile
router.get('/', verifyToken, hasRole(['admin']), ctrl.getAllUsers);
router.get('/:id', verifyToken, ctrl.getUserById);
router.post('/', verifyToken, hasRole(['admin']), ctrl.createUser);
router.put('/:id', verifyToken, ctrl.updateUser);
router.delete('/:id', verifyToken, hasRole(['admin']), ctrl.deleteUser);

//TODO: Add additional logic to check if user is the owner of favorites
router.get('/:id/favorites', verifyToken, ctrl.getFavorites);
router.post('/:id/favorites', verifyToken, ctrl.addFavorite);
router.delete('/:id/favorites/:venueId', verifyToken, ctrl.removeFavorite);

router.get('/profile', verifyToken, ctrl.getUserProfile);
router.put('/profile', verifyToken, ctrl.updateProfile);
router.delete('/account', verifyToken, ctrl.deleteAccount);

module.exports = router;