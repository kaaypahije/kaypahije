const sequelize = require("../config/database");
const User = require("./user.model");
const Category = require("./category.model");
const Subcategory = require("./subcategory.model");
const Business = require("./business.model");
const BusinessGallery = require("./businessGallery.model");
const SiteSetting = require("./siteSetting.model");

Category.hasMany(Subcategory, {
  as: "subcategories",
  foreignKey: "categoryId",
  sourceKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Subcategory.belongsTo(Category, {
  as: "category",
  foreignKey: "categoryId",
  targetKey: "id",
});

Category.hasMany(Business, {
  as: "businesses",
  foreignKey: "categoryId",
  sourceKey: "id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Business.belongsTo(Category, {
  as: "category",
  foreignKey: "categoryId",
  targetKey: "id",
});

Subcategory.hasMany(Business, {
  as: "businesses",
  foreignKey: "subcategoryId",
  sourceKey: "id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Business.belongsTo(Subcategory, {
  as: "subcategory",
  foreignKey: "subcategoryId",
  targetKey: "id",
});

Business.hasMany(BusinessGallery, {
  as: "gallery",
  foreignKey: "businessId",
  sourceKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
BusinessGallery.belongsTo(Business, {
  as: "business",
  foreignKey: "businessId",
  targetKey: "id",
});

module.exports = {
  sequelize,
  User,
  Category,
  Subcategory,
  Business,
  BusinessGallery,
  SiteSetting,
};
