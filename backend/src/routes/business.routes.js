const express = require("express");
const validateRequest = require("../middleware/validate.middleware");
const { requireAuth } = require("../middleware/auth.middleware");
const { businessUpload } = require("../middleware/upload.middleware");
const {
  createBusinessValidator,
  updateBusinessValidator,
} = require("../validators/business.validator");
const {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getFeaturedBusinesses,
  getVerifiedBusinesses,
  getBusinessesByCategory,
  getBusinessesBySubcategory,
  searchBusinesses,
} = require("../controllers/business.controller");

const router = express.Router();

router.get("/", getBusinesses);
router.get("/featured", getFeaturedBusinesses);
router.get("/verified", getVerifiedBusinesses);
router.get("/category/:id", getBusinessesByCategory);
router.get("/subcategory/:id", getBusinessesBySubcategory);
router.get("/search", searchBusinesses);
router.get("/:id", getBusinessById);

router.post(
  "/",
  requireAuth,
  businessUpload,
  createBusinessValidator,
  validateRequest,
  createBusiness,
);
router.put(
  "/:id",
  requireAuth,
  businessUpload,
  updateBusinessValidator,
  validateRequest,
  updateBusiness,
);
router.delete("/:id", requireAuth, deleteBusiness);

module.exports = router;
