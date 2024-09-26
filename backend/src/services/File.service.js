const AES = require("../crypto/AES.js");
const File = require("../model/File.model.js");
const fs = require("fs");
const sha256 = require("../crypto/sha256.js");
const {
  getExtensionFromMimeType,
} = require("../utils/EquivalentMimeTypes.util.js");

exports.uploadFile = async (file, loggedInUser) => {
  const path = `uploads/${loggedInUser.username}`;

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  const fileData = new File({
    filename: `${file.name}.aes`,
    fileType: file.mimetype,
    filePath: path,
    owner: loggedInUser._id,
    encryptedKey: "",
    iv: "",
    hash: new sha256().hash(file.data.toString()),
  });

  const aes = new AES();
  const cipheredFileData = aes.AES_Encrypt(file.data.toString("binary"));

  if (!cipheredFileData) {
    return null;
  }

  fileData.encryptedKey = aes.key;
  fileData.iv = aes.iv;

  saveEncryptedFile(fileData, cipheredFileData);
  await fileData.save();

  return fileData;
};

function saveEncryptedFile(file, cipheredFileData) {
  fs.writeFile(
    `${file.filePath}/${file.filename}`,
    cipheredFileData,
    "binary",
    (err) => {
      if (err) throw err;
    }
  );
}

/**
 *
 * @param {*} fileId
 * @param {*} loggedInUser
 * @returns
 */
exports.downloadFile = async (fileId, loggedInUser) => {
  const file = await File.findById(fileId);

  if (!file) {
    console.log("File not found");
    return null;
  } else {
    console.log("File found");
  }

  if (file.owner.toString() !== loggedInUser._id.toString()) {
    console.log("Unauthorized access");
    return null;
  } else {
    console.log("Authorized access");
  }

  const aes = new AES();
  aes.key = file.encryptedKey;
  aes.iv = file.iv;

  const fileData = fs.readFileSync(
    `${file.filePath}/${file.filename}`,
    "binary"
  );

  const decryptedFileData = aes.AES_Decrypt(
    file.encryptedKey,
    file.iv,
    fileData.toString()
  );

  if (!decryptedFileData) {
    return null;
  }

  if (new sha256().hash(decryptedFileData) !== file.hash) {
    return null;
  }

  return {
    decryptedFileData: decryptedFileData,
    filename: file.filename,
    fileType: file.fileType,
  };
};

/**
 *
 * @param {*} loggedInUserId
 * @returns
 */
exports.getFilesByUser = async (loggedInUserId) => {
  const filesByUser = await File.find(
    { owner: loggedInUserId },
    "filename fileType createdAt"
  );

  filesByUser.forEach((file) => {
    file.fileType = getExtensionFromMimeType(file.fileType);
  });

  return filesByUser;
};
