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
    console.log(response);
    return response;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  userRegistration,
  fetchUserList,
  getUserById,
  fetchEmails,
  fetchSharedUsers,
};
