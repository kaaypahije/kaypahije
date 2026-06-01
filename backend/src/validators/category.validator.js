const { body } = require("express-validator");

const createCategoryValidator = [
  body("name").trim().notEmpty().withMessage("Category name is required"),
  body("slug").optional().trim().isLength({ min: 2 }).withMessage("Invalid slug"),
  body("description").optional().trim(),
  body("featured").optional().isBoolean().withMessage("Featured must be boolean"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

const updateCategoryValidator = [
  body("name").optional().trim().notEmpty().withMessage("Category name cannot be empty"),
  body("slug").optional().trim().isLength({ min: 2 }).withMessage("Invalid slug"),
  body("description").optional().trim(),
  body("featured").optional().isBoolean().withMessage("Featured must be boolean"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
};
