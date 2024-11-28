const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const fileRouter = require("./file");
const userRouter = require("./user");

router.use("/api/auth", authRouter);
router.use("/api/file", fileRouter);
router.use("/api/user", userRouter);

module.exports = router;
