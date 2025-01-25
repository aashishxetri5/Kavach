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

    if (result.success === false) {
      return res.status(403).send(result);
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

// Download a normal unencrypted file
const downloadNormalFiles = async (req, res) => {
  try {
    const { fileId } = req.query;
    const result = await fileService.downloadNormalFile(
      fileId,
      req.user.userId
    );

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
    const tempFilePath = path.join(tempDir, fileName);

    // Write the decrypted file to the temporary path
    fs.writeFileSync(tempFilePath, fileData);

    // Send the file to the user with the correct filename
    res.download(tempFilePath, fileName, (err) => {
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

// Add users to share list
const shareFiles = async (req, res) => {
  const { fileId, emails } = req.body;
  try {
    const response = await fileService.updateShareList(
      fileId,
      emails,
      req.user.userId
    );

    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

const fetchFilesFromShared = async (req, res) => {
  try {
    const response = await fileService.getSharedFiles(req.user.userId);

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

const fileDeleteAction = async (req, res) => {
  const { fileId } = req.body;

  try {
    const response = await fileService.deleteFile(fileId, req.user.username);

    if (response.success === true) {
      return res.status(200).send(response);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

const getTrashedFileAction = async (req, res) => {
  try {
    const response = await fileService.getTrashedFile(req.user.userId);

    if (response.success === true) res.status(200).send(response);
    else throw new Error(response.message);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

const restoreFileAction = async (req, res) => {
  const { fileId } = req.body;

  try {
    const response = await fileService.restoreFile(fileId, req.user.username);

    if (response.success === true) {
      return res.status(200).send(response);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

// Delete a file permanently
const fileDeletePermanentAction = async (req, res) => {
  const { fileId } = req.body;

  try {
    const response = await fileService.permanentFileDeletion(
      fileId,
      req.user.userId
    );

    if (response.success === true) {
      return res.status(200).send(response);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

const cleanTrash = async (req, res) => {
  try {
    const response = await fileService.cleanTrash(req.user.userId);

    if (response.success === true) {
      return res.status(200).send(response);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

module.exports = {
  getFilesForHome,
  upload,
  download,
  downloadNormalFiles,
  getAllFiles,
  shareFiles,
  fetchFilesFromShared,
  fileDeleteAction,
  getTrashedFileAction,
  restoreFileAction,
  fileDeletePermanentAction,
  cleanTrash,
};
