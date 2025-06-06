const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation.middleware');

router.post('/register', validateUserRegistration, ctrl.register);
router.post('/login', validateUserLogin, ctrl.login);
router.post('/logout', verifyToken, ctrl.logout);
router.post('/refresh-token', ctrl.refreshToken);
router.get('/me', verifyToken, ctrl.getMe);

module.exports = router;