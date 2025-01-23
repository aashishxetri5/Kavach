const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/TokenValidation");

const {
  userRegistration,
  fetchUserList,
  getUserById,
  fetchEmails,
  updateProfile,
  updatePassword,
} = require("../controllers/User.controller");

router.post("/register", authenticateToken, userRegistration);

router.get("/list", authenticateToken, fetchUserList);

router.get("/loggedInUser", authenticateToken, getUserById);

router.get("/emails", authenticateToken, fetchEmails);

router.post("/updateProfile", authenticateToken, updateProfile);

router.post("/change-password", authenticateToken, updatePassword);
module.exports = router;
