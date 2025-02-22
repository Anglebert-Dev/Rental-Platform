const { sequelize } = require("../config/database");
const { Property, Booking, User } = require("../models");
const { uploadToCloudinary } = require("../utils/cloudinary");
const crypto = require("crypto");

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
        images,
        featuredImage: imageUrls[0] || null,
        hostId: req.user.id,
      });

      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Failed to create property",
      });
    }
  },

  getProperties: async (req, res) => {
    try {
      const properties = await Property.findAll({
        attributes: {
          include: [
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM "Bookings" WHERE "Bookings"."propertyId" = "Property"."id")'
              ),
              "bookingCount",
            ],
          ],
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
      const { images, featuredImage, ...updateData } = req.body;

      const property = await Property.findOne({
        where: { id, hostId: req.user.id },
      });

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Handle image updates
      if (images && Array.isArray(images)) {
        const newImages = await Promise.all(
          images.map(async (image) => {
            if (image.startsWith("http")) return image; // If it's already a URL, keep it
            const result = await uploadToCloudinary(image); // Upload new images
            return result.secure_url;
          })
        );

        // Replace existing images with new ones
        updateData.images = newImages;

        // Update featured image if provided, otherwise keep the existing one
        updateData.featuredImage = featuredImage || property.featuredImage;
      }

      // Update the property with the new data
      await property.update(updateData);
      res.json(property);
    } catch (error) {
      console.error("Error updating property:", error);
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

      const updatedImages = property.images.filter((img) => img !== imageUrl);
      const updatedFeatured =
        property.featuredImage === imageUrl
          ? updatedImages[0] || null
          : property.featuredImage;

      await property.update({
        images: updatedImages,
        featuredImage: updatedFeatured,
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

  cloudinarySignature: async (req, res) => {
    const timestamp = Math.round(Date.now() / 1000); // Current timestamp in seconds
    const params = {
      folder: "lala-properties",
      timestamp: timestamp,
      unique_filename: false,
      use_filename: true,
    };

    // Sort parameters alphabetically
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    // Generate the signature
    const signature = crypto
      .createHmac("sha1", process.env.CLOUDINARY_API_SECRET)
      .update(sortedParams)
      .digest("hex");

    res.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
    });
  },
};

module.exports = propertyController;
