const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/TokenValidation");

const {
  getFilesForHome,
  upload,
  getAllFiles,
  download,
} = require("../controllers/File.controller");

router.get("/home", authenticateToken, getFilesForHome);

router.get("/all", authenticateToken, getAllFiles);

router.post("/upload", authenticateToken, upload);

router.get("/download", authenticateToken, download);

module.exports = router;
