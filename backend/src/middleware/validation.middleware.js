const { validationResult, check } = require('express-validator');

const validationMiddleware = {
  validateProperty: [
    check('title').notEmpty().trim(),
    check('description').notEmpty().trim(),
    check('pricePerNight').isNumeric(),
    check('location').notEmpty().trim(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ],

  validateBooking: [
    check('propertyId').isUUID(),
    check('checkInDate').isISO8601(),
    check('checkOutDate').isISO8601(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ]
};

module.exports = validationMiddleware;