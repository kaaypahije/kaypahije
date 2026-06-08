const asyncHandler = require("../utils/asyncHandler");
const { SiteSetting } = require("../models");
const { removeLocalFile, toPublicFilePath } = require("../utils/file");

function parseBoolean(value) {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return String(value).toLowerCase() === "true";
}

async function getSingletonSetting() {
  const existing = await SiteSetting.findOne({
    order: [["id", "ASC"]],
  });

  if (existing) {
    return existing;
  }

  return SiteSetting.create({});
}

const getHeroSettings = asyncHandler(async (_req, res) => {
  const settings = await getSingletonSetting();

  res.status(200).json({
    success: true,
    data: {
      heroBannerPrimary: settings.heroBannerPrimary,
      heroBannerSecondary: settings.heroBannerSecondary,
    },
  });
});

const updateHeroSettings = asyncHandler(async (req, res) => {
  const settings = await getSingletonSetting();
  const removePrimaryBanner = parseBoolean(req.body.removeHeroBannerPrimary);
  const removeSecondaryBanner = parseBoolean(req.body.removeHeroBannerSecondary);

  const primaryBannerPath = req.files?.heroBannerPrimary?.[0]
    ? toPublicFilePath(req.files.heroBannerPrimary[0].path)
    : null;
  const secondaryBannerPath = req.files?.heroBannerSecondary?.[0]
    ? toPublicFilePath(req.files.heroBannerSecondary[0].path)
    : null;

  if (primaryBannerPath) {
    if (settings.heroBannerPrimary && settings.heroBannerPrimary !== primaryBannerPath) {
      removeLocalFile(settings.heroBannerPrimary);
    }
    settings.heroBannerPrimary = primaryBannerPath;
  } else if (removePrimaryBanner && settings.heroBannerPrimary) {
    removeLocalFile(settings.heroBannerPrimary);
    settings.heroBannerPrimary = null;
  }

  if (secondaryBannerPath) {
    if (settings.heroBannerSecondary && settings.heroBannerSecondary !== secondaryBannerPath) {
      removeLocalFile(settings.heroBannerSecondary);
    }
    settings.heroBannerSecondary = secondaryBannerPath;
  } else if (removeSecondaryBanner && settings.heroBannerSecondary) {
    removeLocalFile(settings.heroBannerSecondary);
    settings.heroBannerSecondary = null;
  }

  await settings.save();

  res.status(200).json({
    success: true,
    message: "Hero banners updated successfully",
    data: {
      heroBannerPrimary: settings.heroBannerPrimary,
      heroBannerSecondary: settings.heroBannerSecondary,
    },
  });
});

module.exports = {
  getHeroSettings,
  updateHeroSettings,
};
