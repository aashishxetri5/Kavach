const mongoose = require("mongoose");
const File = require("../model/File.model");
const User = require("../model/User.model");

const fs = require("fs");
const AES = require("../crypto/AES");
const SHA256 = require("../crypto/sha256");
// const RSA = require("../crypto/RSA")

/**
 *
 * @param {*} file
 * @param {*} encrypted
 * @param {Object} loggedInUser
 * @returns
 */
const uploadFile = async (file, encrypted, loggedInUser) => {
  try {
    const path = `./uploads/${loggedInUser.username}`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    const fileData = new File({
      filename: `${file.name}.aes`,
      fileType: file.mimetype,
      filePath: path,
      owner: loggedInUser.userId,
      encryptedKey: "",
      iv: "",
      hash: new SHA256().hash(file.data),
    });

    const aes = new AES();
    const cipheredFileData = aes.AES_Encrypt(file.data.toString("hex"));

    const encryptedDataBuffer = Buffer.from(cipheredFileData, "hex");

    if (!cipheredFileData) {
      return null;
    }

    fileData.encryptedKey = aes.key;
    fileData.iv = aes.iv;

    saveEncryptedFile(path, fileData.filename, encryptedDataBuffer);
    await fileData.save();

    return { fileData, cipheredFileData };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while uploading the file",
    };
  }
};

/**
 *
 * @param {*} path
 * @param {*} filename
 * @param {*} cipheredFileData
 */
function saveEncryptedFile(path, filename, cipheredFileData) {
  fs.writeFile(`${path}/${filename}`, cipheredFileData, "binary", (err) => {
    if (err) throw err;
  });
}

/**
 *
 * @param {*} fileId
 * @param {*} loggedInUser
 * @returns
 */
// Download a file
const downloadFile = async (fileId, loggedInUser) => {
  try {
    const file = await File.findById(fileId);

    if (!file) {
      return {
        success: false,
        message: "File not found",
      };
    } else {
      console.log("File found");
    }

    if (file.owner.toString() !== loggedInUser.userId.toString()) {
      console.log("Unauthorized access");
      return;
    }

    const encryptedFileData = fs.readFileSync(
      `${file.filePath}/${file.filename}`
    );

    const encryptedHexData = encryptedFileData.toString("hex");

    const aes = new AES();
    const decryptedHexData = aes.AES_Decrypt(
      file.encryptedKey,
      file.iv,
      encryptedHexData
    );

    const decryptedDataBuffer = Buffer.from(decryptedHexData, "hex");

    return {
      data: decryptedDataBuffer,
      fileName: file.filename, // Original file name or whatever you want to return
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while downloading the file",
    };
  }
};

// Get all files by user
const getFilesByUser = async (userId) => {
  try {
    const files = await File.find({ owner: userId }).select(
      "_id filename fileType filePath createdAt"
    );

    return files;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while fetching files",
    };
  }
};

module.exports = { uploadFile, downloadFile, getFilesByUser };
