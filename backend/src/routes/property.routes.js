const router = require('express').Router();
const propertyController = require('../controllers/property.controller');
const { authenticateToken, isHost } = require('../middleware/auth.middleware');
const { validateProperty } = require('../middleware/validation.middleware');

router.post('/', authenticateToken, isHost, validateProperty, propertyController.createProperty);
router.get('/', propertyController.getProperties);
router.put('/:id', authenticateToken, isHost, validateProperty, propertyController.updateProperty);
router.delete('/:id', authenticateToken, isHost, propertyController.deleteProperty);

module.exports = router;