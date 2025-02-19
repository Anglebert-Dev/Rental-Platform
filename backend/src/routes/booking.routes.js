const router = require('express').Router();
const bookingController = require('../controllers/booking.controller');
const { authenticateToken, isHost } = require('../middleware/auth.middleware');
const { validateBooking } = require('../middleware/validation.middleware');

router.post('/', authenticateToken, validateBooking, bookingController.createBooking);
router.put('/:id/status', authenticateToken, isHost, bookingController.updateBookingStatus);

module.exports = router;