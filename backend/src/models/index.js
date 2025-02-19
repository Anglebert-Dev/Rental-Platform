const User = require('./user.model');
const Property = require('./property.model');
const Booking = require('./booking.model');

// Define relationships
User.hasMany(Property, { foreignKey: 'hostId' });
Property.belongsTo(User, { foreignKey: 'hostId' });

User.hasMany(Booking, { foreignKey: 'renterId' });
Booking.belongsTo(User, { foreignKey: 'renterId' });

Property.hasMany(Booking);
Booking.belongsTo(Property);

module.exports = { User, Property, Booking };