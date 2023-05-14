require("dotenv").config();
const User = require("../../models/User");
const { dbConnection } = require("../config");
const { encrypt } = require("../../utils/handlePassword");

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminName = process.env.ADMIN_NAME;
const adminLastName = process.env.ADMIN_LAST_NAME;

const createAdminUser = async () => {
  try {
    await dbConnection();

    const user = await User.findOne({ email: adminEmail });

    if (user) {
      console.log("[SCRIPT]: Admin user already exists");
    } else {
      const hashedPassword = await encrypt(adminPassword);

      const admin = new User({
        name: adminName,
        lastName: adminLastName,
        email: adminEmail,
        password: hashedPassword,
        ci: "00000000",
        role: "admin",
      });

      const savedUser = await admin.save();

      console.log("[SCRIPT]: Admin user created:", savedUser.email);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createAdminUser();
