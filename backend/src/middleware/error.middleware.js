const ApiError = require("../utils/ApiError");

function notFoundHandler(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV !== "test") {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    errors: error.details || null,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
