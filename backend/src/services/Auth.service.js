const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");

const User = require("../model/User.model");

const validateUserCredentials = async (email, password, existingUserId) => {
  try {
    const user = await User.findOne({ email }).select(
      "name username role password"
    );

    if (!user) {
      return { success: false, message: "Invalid email!! User doesn't exist." };
    }

    // Hash password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Compare password
    if (user.password !== hashedPassword) {
      return { success: false, message: "Invalid password" };
    }

    // Check if the user is already logged in
    if(existingUserId === user._id) {
      console.log(existingUserId, user._id);
      return { success: false, message: "User already logged in" };
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return { success: true, token, userId: user._id };
  } catch (error) {
    console.error("Error in validateUserCredentials:", error);
    return { success: false, message: "Something went wrong!! Try again." };
  }
};

module.exports = { validateUserCredentials };
