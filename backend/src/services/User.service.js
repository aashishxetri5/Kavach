const User = require("../model/User.model");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const emailService = require("./Email.service");
const Sharing = require("../model/Sharing.model");
const { KeyManager } = require("../crypto/RSA");

const { logActivity } = require("../services/Activity.service");
const { logMessages } = require("../utils/LogMessages.util");

const createUser = async (user, currentUser) => {
  try {
    const existingUser = await User.findOne({
      $or: [{ email: user.email }, { username: user.email.split("@")[0] }],
    }).select("email username");

    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    const generatedPassword = crypto.randomBytes(6).toString("base64");

    const newUser = new User({
      fullname: user.fullname,
      email: user.email,
      username: user.email.split("@")[0],
      password: crypto
        .createHash("sha256")
        .update(generatedPassword)
        .digest("hex"),
      role: user.role.toUpperCase(),
    });

    const keyManager = new KeyManager(`C:/SecretKeys/${newUser.username}`);
    keyManager.generateAndSaveKeyPairs();

    try {
      await emailService.sendEmail(
        user.email,
        "Welcome to Kavach",
        `Hi ${newUser.fullname}, Your account has been created successfully.
        <br/><br/>Your username is ${newUser.username}
        <br/><br/>Your password is ${generatedPassword}
        <br/><br/>Your role is ${newUser.role}. You can discuss more about the role and its responsibilities with your admin.
        <br/><br/>Please login to your account and change your password.
        <br/><br/>Thanks, Kavach Team`
      );
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Invalid Email. Please enter a valid email address",
      };
    }

    await newUser.save();

    const message = logMessages.registration(newUser.username, newUser.role);
    await logActivity(
      currentUser.userId,
      "Create",
      newUser.username,
      message
    );

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

const getUsers = async (currentUser) => {
  try {
    const users = await User.find({ _id: { $ne: currentUser } }).select(
      "fullname email role joined_at"
    );

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const getUserDetails = async (userId) => {
  try {
    const user = await User.findById(userId).select(
      "fullname email profilePic"
    );

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const getAllUserEmails = async (userId) => {
  try {
    const emails = await User.find({ _id: { $ne: userId } }).select(
      "email fullname"
    );
    return {
      success: true,
      data: emails,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const getSharedUsers = async (fileId) => {
  try {
    const sharingRecord = await Sharing.findOne({ file: fileId }).populate(
      "sharedWith",
      "email fullname"
    );

    if (!sharingRecord) {
      return {
        success: true,
        message: "No sharing record found for this file.",
        sharedWith: [],
      };
    }

    const sharedWithUsers = sharingRecord.sharedWith.map((user) => ({
      email: user.email,
      fullname: user.fullname,
    }));

    return {
      success: true,
      sharedWith: sharedWithUsers,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while retrieving the shared users.",
      sharedWith: [],
    };
  }
};

const updateUser = async (userId, { fullname, email, profilePicture }) => {
  try {
    const updateData = { fullname, email };

    if (profilePicture) {
      const uploadsDir = path.join(__dirname, "../../profile-pictures");

      // Ensure the uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Save the file, replace the existing file if it exists
      const fileName = `${userId}.${profilePicture.name.split(".").pop()}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, profilePicture.data);

      // Update the profile picture path in the database
      updateData.profilePic = `${process.env.BASE_URL}/profile-pictures/${fileName}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new Error("User not found.");
    }

    const message = logMessages.profileUpdate();
    await logActivity(updatedUser._id, "Update", "", message);

    return updatedUser;
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const changePassword = async (userId, { oldPassword, newPassword }) => {
  try {
    const user = await User.findById(userId).select("password username");

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const hashedOldPassword = crypto
      .createHash("sha256")
      .update(oldPassword)
      .digest("hex");

    const isPasswordMatch = user.password === hashedOldPassword;

    if (!isPasswordMatch) {
      return {
        success: false,
        message: "Incorrect old password.",
      };
    }

    user.password = crypto
      .createHash("sha256")
      .update(newPassword)
      .digest("hex");

    await user.save();

    const message = logMessages.passwordChange();
    await logActivity(userId, "Update", "", message);

    return {
      success: true,
      message: "Password updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserDetails,
  getAllUserEmails,
  getSharedUsers,
  updateUser,
  changePassword,
};
