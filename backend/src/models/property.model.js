const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Property = sequelize.define(
  "Property",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [50, 2000],
      },
    },
    pricePerNight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING), 
      defaultValue: [],
    },
    featuredImage: {
      type: DataTypes.STRING, 
    },
    hostId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    hooks: {
      beforeValidate: (property) => {
        if (
          property.images &&
          property.images.length > 0 &&
          !property.featuredImage
        ) {
          property.featuredImage = property.images[0];
        }
      },
    },
  }
);

module.exports = Property;
