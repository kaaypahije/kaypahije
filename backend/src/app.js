const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const apiRoutes = require("./routes");
const { handleMulterErrors } = require("./middleware/upload.middleware");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(
  cors({
    origin: env.corsOrigin.split(",").map((item) => item.trim()),
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(env.uploadsDir, {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

app.use("/api", apiRoutes);

app.use(handleMulterErrors);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
