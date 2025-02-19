const router = require('express').Router();
const passport = require('passport');
const {authController} = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google'), authController.googleCallback);
router.put('/role', authenticateToken, authController.updateRole);

module.exports = router;