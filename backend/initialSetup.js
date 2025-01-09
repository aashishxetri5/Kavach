const mongoose = require("mongoose");
const crypto = require("crypto");

const User = require("./src/model/User.model");
const { KeyManager } = require("./src/crypto/RSA");

async function setupAdminUser() {
  try {
    // Check if the users collection is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const hashedPassword = crypto
        .createHash("sha256")
        .update("admin")
        .digest("hex");

      // Create the admin user
      const adminUser = new User({
        fullname: "Admin",
        email: "admin@gmail.com",
        username: "admin",
        password: hashedPassword,
        role: "ADMIN",
      });

      const keyManager = new KeyManager("C:/SecretKeys/admin");
      keyManager.generateAndSaveKeyPairs();

      console.log("Initial admin user created successfully.");
      await adminUser.save();
    }
  } catch (error) {
    console.error("Error setting up the admin user:", error);
  }
}

module.exports = setupAdminUser;
