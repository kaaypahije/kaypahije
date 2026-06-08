const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { siteSettingUpload } = require("../middleware/upload.middleware");
const { getHeroSettings, updateHeroSettings } = require("../controllers/siteSetting.controller");

const router = express.Router();

router.get("/hero", getHeroSettings);
router.put("/hero", requireAuth, siteSettingUpload, updateHeroSettings);

module.exports = router;
