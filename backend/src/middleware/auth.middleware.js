const jwt = require("jsonwebtoken");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");

async function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authorization token is required"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    const user = await User.findByPk(payload.userId, {
      attributes: ["id", "name", "email", "role", "status"],
    });

    if (!user || user.status !== "active") {
      return next(new ApiError(401, "Invalid or inactive user"));
    }

    req.user = user;
    return next();
  } catch (_error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}

module.exports = {
  requireAuth,
};
