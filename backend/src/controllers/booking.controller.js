const { Booking, Property } = require('../models');
const { isAvailable } = require('../services/booking.service');

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const { propertyId, checkInDate, checkOutDate } = req.body;
      
      if (!await isAvailable(propertyId, checkInDate, checkOutDate)) {
        return res.status(400).json({ message: 'Property not available for these dates' });
      }

      const property = await Property.findByPk(propertyId);
      const totalNights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
      const totalPrice = totalNights * property.pricePerNight;

      const booking = await Booking.create({
        propertyId,
        renterId: req.user.id,
        checkInDate,
        checkOutDate,
        totalPrice,
        status: 'pending'
      });

      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error:error.message ,message: 'Failed to create booking' });
    }
  },

  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const booking = await Booking.findOne({
        include: [{ model: Property, where: { hostId: req.user.id } }],
        where: { id }
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      booking.status = status;
      await booking.save();
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update booking status' });
    }
  }
};

module.exports = bookingController;