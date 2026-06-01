const express = require("express");
const validateRequest = require("../middleware/validate.middleware");
const { requireAuth } = require("../middleware/auth.middleware");
const { registerValidator, loginValidator } = require("../validators/auth.validator");
const { register, login, me } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.get("/me", requireAuth, me);

module.exports = router;
