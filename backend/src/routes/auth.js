const express = require("express");
const router = express.Router();

const { login, logout, sendPhrase, validatePhrase } = require("../controllers/Auth.controller");
const { authenticateToken } = require("../middleware/TokenValidation");

router.post("/login", login);

router.post("/logout", logout);

router.post('/request-download', authenticateToken, sendPhrase);

router.post('/validate-phrase', authenticateToken, validatePhrase);

module.exports = router;
