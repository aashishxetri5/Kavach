const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/TokenValidation");

const {
  getFilesForHome,
  upload,
  getAllFiles,
  download,
  downloadNormalFiles,
  shareFiles,
  fetchFilesFromShared,
} = require("../controllers/File.controller");

const { fetchSharedUsers } = require("../controllers/User.controller");

router.get("/home", authenticateToken, getFilesForHome);

router.get("/all", authenticateToken, getAllFiles);

router.post("/upload", authenticateToken, upload);

router.get("/download", authenticateToken, download);

router.get("/normaldownload", authenticateToken, downloadNormalFiles);

router.post("/share", authenticateToken, shareFiles);

router.get("/sharedWith/:fileId", authenticateToken, async (req, res) => {
  const { fileId } = req.params;
  const result = await fetchSharedUsers(fileId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
});

router.get("/shared", authenticateToken, fetchFilesFromShared);

module.exports = router;
