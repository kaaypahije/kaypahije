const express = require("express");
const validateRequest = require("../middleware/validate.middleware");
const { requireAuth } = require("../middleware/auth.middleware");
const { categoryUpload } = require("../middleware/upload.middleware");
const {
  createCategoryValidator,
  updateCategoryValidator,
} = require("../validators/category.validator");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", requireAuth, categoryUpload, createCategoryValidator, validateRequest, createCategory);
router.put(
  "/:id",
  requireAuth,
  categoryUpload,
  updateCategoryValidator,
  validateRequest,
  updateCategory,
);
router.delete("/:id", requireAuth, deleteCategory);

module.exports = router;
