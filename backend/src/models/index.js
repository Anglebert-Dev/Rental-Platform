const User = require("./user.model");
const Property = require("./property.model");
const Booking = require("./booking.model");

// Define relationships
User.hasMany(Property, { foreignKey: "hostId" });
Property.belongsTo(User, { foreignKey: "hostId" , as:"host" }); // Add 'as' alias

User.hasMany(Booking, { foreignKey: "renterId" });
Booking.belongsTo(User, { foreignKey: "renterId" , as: "renter" }); 

// Fix the Property-Booking relationship
Property.hasMany(Booking, { foreignKey: "propertyId" });
Booking.belongsTo(Property, { foreignKey: "propertyId", as: "property" }); // Add 'as' alias

module.exports = { User, Property, Booking };
