const router = require('express').Router();
const {createBooking,updateBookingStatus} = require('../controllers/booking.controller');
const { authenticateToken, isHost } = require('../middleware/auth.middleware');
const { validateBooking } = require('../middleware/validation.middleware');

router.post('/', authenticateToken, validateBooking, createBooking);
router.put('/:id/status', authenticateToken, isHost, updateBookingStatus);

module.exports = router;