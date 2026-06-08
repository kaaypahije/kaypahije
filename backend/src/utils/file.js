const path = require("path");
const fs = require("fs");
const env = require("../config/env");

function toPublicFilePath(fullPath) {
  const uploadsRoot = env.uploadsDir;
  const relative = path.relative(uploadsRoot, fullPath);
  return `/uploads/${relative.replace(/\\/g, "/")}`;
}

function removeLocalFile(publicPath) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) {
    return;
  }

  const relativePath = publicPath.replace(/^\/uploads\//, "");
  const filePath = path.resolve(env.uploadsDir, relativePath);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = {
  toPublicFilePath,
  removeLocalFile,
};
