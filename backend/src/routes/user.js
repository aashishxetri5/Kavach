const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/TokenValidation");

const {
  userRegistration,
  fetchUserList,
  getUserById,
  fetchEmails,
} = require("../controllers/User.controller");

router.post("/register", authenticateToken, userRegistration);

router.get("/list", authenticateToken, fetchUserList);

router.get("/loggedInUser", authenticateToken, getUserById);

router.get("/emails", authenticateToken, fetchEmails);

module.exports = router;
