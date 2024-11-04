const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const fileRouter = require("./file");

router.use("/api/auth", authRouter);
router.use("/api/file", fileRouter);

module.exports = router;
