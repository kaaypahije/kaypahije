const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SiteSetting = sequelize.define(
  "SiteSetting",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    heroBannerPrimary: {
      field: "hero_banner_primary",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    heroBannerSecondary: {
      field: "hero_banner_secondary",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "site_settings",
  },
);

module.exports = SiteSetting;
