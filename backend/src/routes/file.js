const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/TokenValidation");

const {
  upload,
  getAllFiles,
  download,
} = require("../controllers/File.controller");

router.get("/home", authenticateToken, async (req, res) => {
  res.send({ mesasge: "Hello World" });
});

router.get("/all", authenticateToken, getAllFiles);

router.post("/upload", authenticateToken, upload);

router.get("/download", authenticateToken, download);

module.exports = router;
