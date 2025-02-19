require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("./src/config/passport");
const { sequelize } = require("./src/config/database");
const errorHandler = require("./src/utils/errorHandler");
const session = require("express-session");

// Import routes
const authRoutes = require("./src/routes/auth.routes");
const propertyRoutes = require("./src/routes/property.routes");
const bookingRoutes = require("./src/routes/booking.routes");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);

// Error handling
app.use(errorHandler.handleError);

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Sync database (in development)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("Database synced.");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer();
