const path = require("path");
const fs = require("fs");

function toPublicFilePath(fullPath) {
  const uploadsRoot = path.resolve(process.cwd(), "uploads");
  const relative = path.relative(uploadsRoot, fullPath);
  return `/uploads/${relative.replace(/\\/g, "/")}`;
}

function removeLocalFile(publicPath) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) {
    return;
  }

  const relativePath = publicPath.replace(/^\/uploads\//, "");
  const filePath = path.resolve(process.cwd(), "uploads", relativePath);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = {
  toPublicFilePath,
  removeLocalFile,
};
