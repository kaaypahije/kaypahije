const express = require("express");
const validateRequest = require("../middleware/validate.middleware");
const { requireAuth } = require("../middleware/auth.middleware");
const { subcategoryUpload } = require("../middleware/upload.middleware");
const {
  createSubcategoryValidator,
  updateSubcategoryValidator,
} = require("../validators/subcategory.validator");
const {
  createSubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/subcategory.controller");

const router = express.Router();

router.get("/", getSubcategories);
router.get("/category/:categoryId", getSubcategoriesByCategory);
router.post(
  "/",
  requireAuth,
  subcategoryUpload,
  createSubcategoryValidator,
  validateRequest,
  createSubcategory,
);
router.put(
  "/:id",
  requireAuth,
  subcategoryUpload,
  updateSubcategoryValidator,
  validateRequest,
  updateSubcategory,
);
router.delete("/:id", requireAuth, deleteSubcategory);

module.exports = router;
