const router = require('express').Router();
const {deleteProperty, updateProperty, createProperty, getProperties, getAllProperties, cloudinarySignature, getPropertyById} = require('../controllers/property.controller');
const { authenticateToken, isHost } = require('../middleware/auth.middleware');
const { validateProperty } = require('../middleware/validation.middleware');

router.post('/', authenticateToken, isHost, validateProperty, createProperty);
router.get('/my-properties', authenticateToken, isHost, getProperties);
router.get('/', getAllProperties);
router.get('/signature', cloudinarySignature);
router.get('/:id', getPropertyById);
router.put('/:id', authenticateToken, isHost, validateProperty, updateProperty);
router.delete('/:id', authenticateToken, isHost, deleteProperty);

module.exports = router;