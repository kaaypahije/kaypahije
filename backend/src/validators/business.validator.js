const { body } = require("express-validator");

const statusValues = ["active", "inactive"];

const createBusinessValidator = [
  body("businessName").trim().notEmpty().withMessage("Business name is required"),
  body("slug").optional().trim(),
  body("categoryId")
    .notEmpty()
    .withMessage("Category is required")
    .isInt({ min: 1 })
    .withMessage("Invalid category ID"),
  body("subcategoryId")
    .notEmpty()
    .withMessage("Subcategory is required")
    .isInt({ min: 1 })
    .withMessage("Invalid subcategory ID"),
  body("mobile").trim().notEmpty().withMessage("Mobile number is required"),
  body("whatsapp").optional({ values: "falsy" }).trim(),
  body("email").optional({ values: "falsy" }).isEmail().withMessage("Invalid email"),
  body("website")
    .optional({ values: "falsy" })
    .isURL({ require_protocol: true })
    .withMessage("Website must include http/https"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("area").optional().trim(),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("pincode").optional().trim(),
  body("mapLink")
    .optional({ values: "falsy" })
    .isURL({ require_protocol: true })
    .withMessage("Map link must include http/https"),
  body("latitude")
    .optional({ values: "falsy" })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  body("longitude")
    .optional({ values: "falsy" })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
  body("description").optional().trim(),
  body("services")
    .optional({ values: "falsy" })
    .custom((value) => {
      if (Array.isArray(value)) {
        return true;
      }
      if (typeof value === "string") {
        return true;
      }
      throw new Error("Services must be comma-separated string or array");
    }),
  body("openingTime").optional().trim(),
  body("closingTime").optional().trim(),
  body("featured").optional().isBoolean().withMessage("Featured must be boolean"),
  body("verified").optional().isBoolean().withMessage("Verified must be boolean"),
  body("status").optional().isIn(statusValues).withMessage("Invalid status"),
  body("seoTitle").optional().trim(),
  body("seoDescription").optional().trim(),
];

const updateBusinessValidator = [
  body("businessName").optional().trim().notEmpty().withMessage("Business name cannot be empty"),
  body("slug").optional().trim(),
  body("categoryId").optional().isInt({ min: 1 }).withMessage("Invalid category ID"),
  body("subcategoryId").optional().isInt({ min: 1 }).withMessage("Invalid subcategory ID"),
  body("mobile").optional().trim(),
  body("whatsapp").optional({ values: "falsy" }).trim(),
  body("email").optional({ values: "falsy" }).isEmail().withMessage("Invalid email"),
  body("website")
    .optional({ values: "falsy" })
    .isURL({ require_protocol: true })
    .withMessage("Website must include http/https"),
  body("address").optional().trim(),
  body("area").optional().trim(),
  body("city").optional().trim(),
  body("state").optional().trim(),
  body("pincode").optional().trim(),
  body("mapLink")
    .optional({ values: "falsy" })
    .isURL({ require_protocol: true })
    .withMessage("Map link must include http/https"),
  body("latitude")
    .optional({ values: "falsy" })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  body("longitude")
    .optional({ values: "falsy" })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
  body("description").optional().trim(),
  body("services")
    .optional({ values: "falsy" })
    .custom((value) => {
      if (Array.isArray(value)) {
        return true;
      }
      if (typeof value === "string") {
        return true;
      }
      throw new Error("Services must be comma-separated string or array");
    }),
  body("openingTime").optional().trim(),
  body("closingTime").optional().trim(),
  body("featured").optional().isBoolean().withMessage("Featured must be boolean"),
  body("verified").optional().isBoolean().withMessage("Verified must be boolean"),
  body("status").optional().isIn(statusValues).withMessage("Invalid status"),
  body("seoTitle").optional().trim(),
  body("seoDescription").optional().trim(),
];

module.exports = {
  createBusinessValidator,
  updateBusinessValidator,
};
