const express = require("express");
const authRoutes = require("./auth.routes");
const categoryRoutes = require("./category.routes");
const subcategoryRoutes = require("./subcategory.routes");
const businessRoutes = require("./business.routes");
const dashboardRoutes = require("./dashboard.routes");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/subcategories", subcategoryRoutes);
router.use("/businesses", businessRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
