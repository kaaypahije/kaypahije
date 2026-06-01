const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { getDashboardStats } = require("../controllers/dashboard.controller");

const router = express.Router();

router.get("/stats", requireAuth, getDashboardStats);

module.exports = router;
