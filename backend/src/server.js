const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const { DataTypes } = require("sequelize");

process.chdir(path.resolve(__dirname, ".."));

const env = require("./config/env");
const app = require("./app");
const { sequelize } = require("./models");

function ensureUploadFolders() {
  ["categories", "subcategories", "businesses", "site"].forEach((folder) => {
    fs.mkdirSync(path.resolve(env.uploadsDir, folder), { recursive: true });
  });
}

async function ensureBusinessMartColumns() {
  const queryInterface = sequelize.getQueryInterface();
  const table = await queryInterface.describeTable("businesses");

  if (!table.price) {
    await queryInterface.addColumn("businesses", "price", {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    });
  }

  if (!table.price_label) {
    await queryInterface.addColumn("businesses", "price_label", {
      type: DataTypes.STRING(120),
      allowNull: true,
    });
  }
}

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${env.db.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  );
  await connection.end();
}

async function bootstrap() {
  try {
    ensureUploadFolders();
    await ensureDatabaseExists();
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
    await ensureBusinessMartColumns();

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
}

bootstrap();
