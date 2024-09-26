const fileService = require("../services/File.service.js");
const fs = require("fs");
const path = require("path");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.uploadFile = async (req, res, next) => {
  const { file } = req.files;

  const fileData = await fileService.uploadFile(file, req.session.loggedInUser);

  if (!fileData) req.flash({ error: "Error uploading file" });
  else req.flash({ success: "File uploaded successfully" });

  return res.redirect("/my-storage");
};

/**
 *
 * @param {*} loggedInUser
 * @returns
 */
exports.getFilesByUser = async (loggedInUser) => {
  const filesByUser = await fileService.getFilesByUser(loggedInUser._id);

  return filesByUser;
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.downloadFile = async (req, res, next) => {
  const { fileId } = req.params;

  const fileData = await fileService.downloadFile(
    fileId,
    req.session.loggedInUser
  );

  if (!fileData) {
    req.flash({ error: "Error downloading file" });
    return res.redirect("/my-storage");
  }

  // Define the path where the decrypted file will be temporarily saved
  const tempDir = path.join(__dirname, "..", "temp");

  // Ensure the temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // Construct the path for the decrypted file (temporary file storage)
  const tempFilePath = path.join(
    tempDir,
    fileData.filename.replace(/\.aes$/, "")
  );

  // Write the decrypted file data to the temporary file
  fs.writeFileSync(tempFilePath, fileData.decryptedFileData, "binary");

  // Send the file to the user with the correct filename
  res.download(tempFilePath, fileData.filename.replace(/\.aes$/, ""), (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      req.flash({ error: "Error downloading file." });
      return res.redirect("/my-storage");
    }

    // Once the file is downloaded, remove the temporary file
    fs.unlink(tempFilePath, (err) => {
      if (err) {
        console.error("Error removing temporary file:", err);
      }
    });
  });
};
