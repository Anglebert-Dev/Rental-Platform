const { sequelize } = require("../config/database");
const { Property, Booking, User } = require("../models");
const { uploadToCloudinary } = require('../utils/cloudinary'); 

const propertyController = {
  createProperty: async (req, res) => {
    try {
      const { title, description, pricePerNight, location, images } = req.body;
      
      // Upload images if provided
      let imageUrls = [];
      if (images && images.length > 0) {
        imageUrls = await Promise.all(
          images.map(async (image) => {
            const result = await uploadToCloudinary(image);
            return result.secure_url;
          })
        );
      }

      const property = await Property.create({
        title,
        description,
        pricePerNight,
        location,
        images: imageUrls,
        featuredImage: imageUrls[0] || null,
        hostId: req.user.id,
      });

      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({ 
        error: error.message, 
        message: "Failed to create property" 
      });
    }
  },

  getProperties: async (req, res) => {
    try {
      const properties = await Property.findAll({
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM "Bookings" WHERE "Bookings"."propertyId" = "Property"."id")'), 'bookingCount']
          ]
        },
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
            attributes: ["id", "name", "email", "profilePicture"],
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
            attributes: ["id", "name", "email", "profilePicture"],
          },
        ],
      });

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  },

  updateProperty: async (req, res) => {
    try {
      const { id } = req.params;
      const { images, ...updateData } = req.body;

      const property = await Property.findOne({
        where: { id, hostId: req.user.id },
      });

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Handle image updates
      if (images && images.length > 0) {
        const newImages = await Promise.all(
          images.map(async (image) => {
            if (image.startsWith('http')) return image;
            const result = await uploadToCloudinary(image);
            return result.secure_url;
          })
        );

        updateData.images = [...property.images, ...newImages];
        if (!updateData.featuredImage) {
          updateData.featuredImage = newImages[0] || property.featuredImage;
        }
      }

      await property.update(updateData);
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to update property" });
    }
  },

  deletePropertyImage: async (req, res) => {
    try {
      const { id, imageUrl } = req.params;
      
      const property = await Property.findOne({
        where: { id, hostId: req.user.id },
      });

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const updatedImages = property.images.filter(img => img !== imageUrl);
      const updatedFeatured = property.featuredImage === imageUrl ? 
        (updatedImages[0] || null) : 
        property.featuredImage;

      await property.update({
        images: updatedImages,
        featuredImage: updatedFeatured
      });

      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete image" });
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