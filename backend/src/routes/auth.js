const express = require("express");
const router = express.Router();

const { login, logout } = require("../controllers/Auth.controller");
const { authenticateToken } = require("../middleware/TokenValidation");

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;
