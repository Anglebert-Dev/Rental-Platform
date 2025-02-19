// const Property = require('../models/property.model');
// const Booking = require('../models/booking.model');
const {Property , Booking} = require('../models');

const propertyController = {
  createProperty: async (req, res) => {
    try {
      const { title, description, pricePerNight, location } = req.body;
      const property = await Property.create({
        title,
        description,
        pricePerNight,
        location,
        hostId: req.user.id
      });
      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({ error:error.message ,message: 'Failed to create property' });
    }
  },

  getProperties: async (req, res) => {
    try {
      const properties = await Property.findAll({
        include: [{
          model: Booking,
          attributes: ['checkInDate', 'checkOutDate', 'status']
        }]
      });
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error:error.message , message: 'Failed to fetch properties' });
    }
  },

  updateProperty: async (req, res) => {
    try {
      const { id } = req.params;
      const property = await Property.findOne({
        where: { id, hostId: req.user.id }
      });
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      await property.update(req.body);
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update property' });
    }
  },

  deleteProperty: async (req, res) => {
    try {
      const { id } = req.params;
      const property = await Property.findOne({
        where: { id, hostId: req.user.id }
      });
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      await property.destroy();
      res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete property' });
    }
  }
};

module.exports = propertyController;