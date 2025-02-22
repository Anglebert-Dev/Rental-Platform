const { Booking, Property, User } = require("../models");
const { isAvailable } = require("../services/booking.service");

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const { propertyId, checkInDate, checkOutDate } = req.body;

      // Fetch property to calculate total price

      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (!(await isAvailable(propertyId, checkInDate, checkOutDate))) {
        return res
          .status(400)
          .json({ message: "Property not available for these dates" });
      }

      // Calculate total nights and price
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      const totalNights = Math.ceil(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = totalNights * property.pricePerNight;

      const booking = await Booking.create({
        propertyId,
        renterId: req.user.id,
        checkInDate,
        checkOutDate,
        totalPrice,
        status: "pending",
      });

      // Fetch the created booking with associated data
      const bookingWithDetails = await Booking.findByPk(booking.id, {
        include: [
          {
            model: Property,
            as: "property",
            attributes: ["id", "title", "location"],
          },
          {
            model: User,
            as: "renter",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      res.status(201).json(bookingWithDetails);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  },

  getBookings: async (req, res) => {
    try {
      const bookings = await Booking.findAll({
        include: [
          {
            model: Property,
            as: "property",
            attributes: ["id", "title", "location", "pricePerNight"],
          },
          {
            model: User,
            as: "renter",
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  },

  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const booking = await Booking.findOne({
        include: [
          {
            model: Property,
            as: "property", // Add the alias here
            where: { hostId: req.user.id },
          },
        ],
        where: { id },
      });

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      booking.status = status;
      await booking.save();
      res.json(booking);
    } catch (error) {
      res
        .status(500)
        .json({
          error: error.message,
          message: "Failed to update booking status",
        });
    }
  },
};

module.exports = bookingController;
