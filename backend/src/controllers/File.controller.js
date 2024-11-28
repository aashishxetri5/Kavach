const fs = require("fs");
const path = require("path");

const fileService = require("../services/File.service");

const getFilesForHome = async (req, res) => {
  try {
    const response = await fileService.fetchDisplayFiles(req.user.userId);
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

// Upload a file
const upload = async (req, res) => {
  const { file } = req.files;
  const { encrypted } = req.body;

  try {
    const response = await fileService.uploadFile(file, encrypted, req.user);

    res.status(201).send({ response });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

// Download a file
const download = async (req, res) => {
  try {
    const { fileId } = req.query;
    const result = await fileService.downloadFile(fileId, req.user);

    if (!result) {
      return res
        .status(404)
        .send({ success: false, message: "File not found" });
    }

    const { data: fileData, fileName } = result;

    const tempDir = path.join(__dirname, "..", "temp");

    // Ensure the temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Construct the path for the decrypted file (temporary file storage)
    const tempFilePath = path.join(tempDir, fileName.replace(/\.aes$/, ""));

    // Write the decrypted file to the temporary path
    fs.writeFileSync(tempFilePath, fileData);

    // Send the file to the user with the correct filename
    res.download(tempFilePath, fileName.replace(/\.aes$/, ""), (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        return res
          .status(500)
          .send({ success: false, message: "Error downloading file." });
      }

      // Once the file is downloaded, remove the temporary file
      fs.unlink(tempFilePath, (err) => {
        if (err) {
          console.error("Error removing temporary file:", err);
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, message: error.message });
  }
};

// Get all files
const getAllFiles = async (req, res) => {
  try {
    const filesByUser = await fileService.getFilesByUser(req.user.userId);

    res.status(200).send({ files: filesByUser });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

module.exports = { getFilesForHome, upload, download, getAllFiles };
