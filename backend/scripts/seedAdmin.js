const bcrypt = require("bcryptjs");
const path = require("path");

process.chdir(path.resolve(__dirname, ".."));

const { sequelize, User } = require("../src/models");

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    const email = "kaaypahije@gmail.com";
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      // eslint-disable-next-line no-console
      console.log(`Admin already exists: ${email}`);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email,
      password: passwordHash,
      role: "admin",
      status: "active",
    });

    // eslint-disable-next-line no-console
    console.log("Admin created successfully");
    // eslint-disable-next-line no-console
    console.log("Email: kaaypahije@gmail.com");
    // eslint-disable-next-line no-console
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
}

run();
