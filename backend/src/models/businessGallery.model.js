const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BusinessGallery = sequelize.define(
  "BusinessGallery",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    businessId: {
      field: "business_id",
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "business_gallery",
    updatedAt: false,
  },
);

module.exports = BusinessGallery;
