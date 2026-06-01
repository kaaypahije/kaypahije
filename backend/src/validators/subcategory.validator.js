const { body } = require("express-validator");

const createSubcategoryValidator = [
  body("categoryId")
    .notEmpty()
    .withMessage("Category is required")
    .isInt({ min: 1 })
    .withMessage("Invalid category ID"),
  body("name").trim().notEmpty().withMessage("Subcategory name is required"),
  body("slug").optional().trim().isLength({ min: 2 }).withMessage("Invalid slug"),
  body("description").optional().trim(),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

const updateSubcategoryValidator = [
  body("categoryId").optional().isInt({ min: 1 }).withMessage("Invalid category ID"),
  body("name").optional().trim().notEmpty().withMessage("Subcategory name cannot be empty"),
  body("slug").optional().trim().isLength({ min: 2 }).withMessage("Invalid slug"),
  body("description").optional().trim(),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

module.exports = {
  createSubcategoryValidator,
  updateSubcategoryValidator,
};
