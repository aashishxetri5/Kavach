const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/TokenValidation");

const { uploadFile } = require("../controllers/File.controller");

router.get("/home", authenticateToken, async (req, res) => {
  res.send({ mesasge: "Hello World" });
});

router.post("/upload", authenticateToken, uploadFile);

router.get("/download", authenticateToken, downloadFile);

module.exports = router;
