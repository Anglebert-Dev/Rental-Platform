require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { sequelize } = require('./src/models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/properties', require('./src/routes/property.routes'));
app.use('/api/bookings', require('./src/routes/booking.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();