const { Booking } = require('../models');
const { Op } = require('sequelize');

const bookingService = {
  isAvailable: async (propertyId, checkInDate, checkOutDate) => {
    const conflictingBookings = await Booking.findOne({
      where: {
        propertyId,
        status: {
          [Op.ne]: 'canceled'
        },
        [Op.or]: [
          {
            checkInDate: {
              [Op.between]: [checkInDate, checkOutDate]
            }
          },
          {
            checkOutDate: {
              [Op.between]: [checkInDate, checkOutDate]
            }
          }
        ]
      }
    });
    return !conflictingBookings;
  }
};

module.exports = bookingService;