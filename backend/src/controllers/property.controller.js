const { Property, Booking, User } = require("../models");

const propertyController = {
  createProperty: async (req, res) => {
    try {
      const { title, description, pricePerNight, location } = req.body;
      const property = await Property.create({
        title,
        description,
        pricePerNight,
        location,
        hostId: req.user.id,
      });
      res.status(201).json(property);
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message, message: "Failed to create property" });
    }
  },

  getProperties: async (req, res) => {
    try {
      const properties = await Property.findAll({
        include: [
          {
            model: Booking,
            attributes: [
              "id",
              "checkInDate",
              "checkOutDate",
              "status",
              "totalPrice",
            ],
            include: [
              {
                model: User,
                as: "renter",
                attributes: ["id", "name", "email"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  },

  getPropertyById: async (req, res) => {
    try {
      const property = await Property.findByPk(req.params.id, {
        include: [
          {
            model: Booking,
            attributes: [
              "id",
              "checkInDate",
              "checkOutDate",
              "status",
              "totalPrice",
            ],
            include: [
              {
                model: User,
                as: "renter",
                attributes: ["id", "name", "email"],
              },
            ],
          },
          {
            model: User,
            as: "host",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({  message: "Failed to fetch property" });
    }
  },

  updateProperty: async (req, res) => {
    try {
      const { id } = req.params;
      const property = await Property.findOne({
        where: { id, hostId: req.user.id },
      });
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      await property.update(req.body);
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to update property" });
    }
  },

  deleteProperty: async (req, res) => {
    try {
      const { id } = req.params;
      const property = await Property.findOne({
        where: { id, hostId: req.user.id },
      });
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      await property.destroy();
      res.json({ message: "Property deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete property" });
    }
  },
};

module.exports = propertyController;
