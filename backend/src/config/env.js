const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || "kaypahije",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "change_this_to_a_long_random_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};

module.exports = env;
