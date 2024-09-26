const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware.js");
const authController = require("../controller/Auth.controller.js");

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post("/login", authController.validateLogin);

router.get("/", (req, res) => {
  res.render("index");
});

router.use(authMiddleware);

module.exports = router;
