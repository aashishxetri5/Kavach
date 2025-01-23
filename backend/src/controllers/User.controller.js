const userService = require("../services/User.service");

const userRegistration = async (req, res) => {
  try {
    const response = await userService.createUser(req.body);
    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const fetchUserList = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const response = await userService.getUsers(req.user.userId);
    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const response = await userService.getUserDetails(req.user.userId);
    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const fetchEmails = async (req, res) => {
  try {
    const response = await userService.getAllUserEmails(req.user.userId);
    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const fetchSharedUsers = async (fileId) => {
  try {
    const response = await userService.getSharedUsers(fileId);
    return response;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullname, email } = req.body;
    const profilePicture = req.files?.profilePicture;

    const updatedUser = await userService.updateUser(userId, {
      fullname,
      email,
      profilePicture,
    });

    res.status(200).json({
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    const response = await userService.changePassword(userId, {
      oldPassword,
      newPassword,
    });

    if (!response.success) {
      return res.status(400).json(response);
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  userRegistration,
  fetchUserList,
  getUserById,
  fetchEmails,
  fetchSharedUsers,
  updateProfile,
  updatePassword,
};
