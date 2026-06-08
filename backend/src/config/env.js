const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

const defaultUploadsDir = path.resolve(process.cwd(), "uploads");

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  db: {
    host: firstDefined(process.env.DB_HOST, process.env.MYSQLHOST) || "127.0.0.1",
    port: Number(firstDefined(process.env.DB_PORT, process.env.MYSQLPORT) || 3306),
    name: firstDefined(process.env.DB_NAME, process.env.MYSQLDATABASE) || "kaypahije",
    user: firstDefined(process.env.DB_USER, process.env.MYSQLUSER) || "root",
    password: firstDefined(process.env.DB_PASSWORD, process.env.MYSQLPASSWORD) || "root",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "change_this_to_a_long_random_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  uploadsDir: path.resolve(process.cwd(), process.env.UPLOADS_DIR || defaultUploadsDir),
};

module.exports = env;
