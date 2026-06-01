const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Business = sequelize.define(
  "Business",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      field: "category_id",
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    subcategoryId: {
      field: "subcategory_id",
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    businessName: {
      field: "business_name",
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    banner: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    whatsapp: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    mapLink: {
      field: "map_link",
      type: DataTypes.TEXT,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    services: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("services");
        if (!raw) {
          return [];
        }
        try {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      },
      set(value) {
        if (!value) {
          this.setDataValue("services", JSON.stringify([]));
          return;
        }

        if (Array.isArray(value)) {
          this.setDataValue("services", JSON.stringify(value));
          return;
        }

        const asString = String(value)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        this.setDataValue("services", JSON.stringify(asString));
      },
    },
    openingTime: {
      field: "opening_time",
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    closingTime: {
      field: "closing_time",
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    seoTitle: {
      field: "seo_title",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    seoDescription: {
      field: "seo_description",
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "businesses",
    indexes: [
      {
        fields: ["category_id"],
      },
      {
        fields: ["subcategory_id"],
      },
      {
        fields: ["city"],
      },
      {
        fields: ["status"],
      },
    ],
  },
);

module.exports = Business;
