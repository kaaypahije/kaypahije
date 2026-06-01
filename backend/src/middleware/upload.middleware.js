const fs = require("fs");
const path = require("path");
const multer = require("multer");
const ApiError = require("../utils/ApiError");

function ensureDir(folder) {
  const fullPath = path.resolve(process.cwd(), "uploads", folder);
  fs.mkdirSync(fullPath, { recursive: true });
  return fullPath;
}

function createUploader(folder) {
  const destination = ensureDir(folder);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, destination);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeBase = file.originalname
        .replace(ext, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);

      cb(null, `${safeBase || "image"}-${Date.now()}${ext}`);
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        cb(new ApiError(400, "Only image files are allowed"));
        return;
      }
      cb(null, true);
    },
  });
}

const categoryUpload = createUploader("categories").single("image");
const subcategoryUpload = createUploader("subcategories").single("image");
const businessUpload = createUploader("businesses").fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "gallery", maxCount: 15 },
]);

function handleMulterErrors(err, _req, _res, next) {
  if (!err) {
    next();
    return;
  }

  if (err instanceof multer.MulterError) {
    next(new ApiError(400, err.message));
    return;
  }

  next(err);
}

module.exports = {
  categoryUpload,
  subcategoryUpload,
  businessUpload,
  handleMulterErrors,
};
