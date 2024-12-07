const File = require("../model/File.model");
const Sharing = require("../model/Sharing.model");
const mongoose = require("mongoose");
const {
  getExtensionFromMimeType,
} = require("../utils/EquivalentMimeTypes.util");

const fs = require("fs");
const AES = require("../crypto/AES");
const SHA256 = require("../crypto/sha256");
const User = require("../model/User.model");
// const RSA = require("../crypto/RSA")

const fetchDisplayFiles = async (userId) => {
  try {
    const encryptedFiles = await File.find({
      $and: [{ owner: userId }, { encryptedKey: { $nin: [null, ""] } }],
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("_id filename fileType filePath createdAt");

    const unencryptedFiles = await File.find({
      $and: [{ owner: userId }, { encryptedKey: { $in: [null, ""] } }],
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("_id filename fileType filePath createdAt");

    encryptedFiles.forEach((file) => {
      file.fileType = getExtensionFromMimeType(file.fileType);
    });

    unencryptedFiles.forEach((file) => {
      file.fileType = getExtensionFromMimeType(file.fileType);
    });

    return {
      success: true,
      data: { encryptedFiles, unencryptedFiles },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while fetching files",
    };
  }
};

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
      filename: `${file.name}`,
      fileType: file.mimetype,
      filePath: path,
      encryptedKey: "",
      iv: "",
      owner: loggedInUser.userId,
      hash: new SHA256().hash(file.data),
    });

    if (encrypted === "true") {
      const aes = new AES();
      const cipheredFileData = aes.AES_Encrypt(file.data.toString("hex"));

      const encryptedDataBuffer = Buffer.from(cipheredFileData, "hex");

      if (!cipheredFileData) {
        return null;
      }

      fileData.encryptedKey = aes.key;
      fileData.iv = aes.iv;
      fileData.filename = `${file.name}.aes`;
      saveEncryptedFile(path, fileData.filename, encryptedDataBuffer);
      await fileData.save();
      return { fileData, cipheredFileData };
    }

    saveNormalFile(path, fileData.filename, file.data);
    await fileData.save();
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

// Saves files without encryption
function saveNormalFile(path, filename, fileData) {
  fs.writeFile(`${path}/${filename}`, fileData, "binary", (err) => {
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

    if (
      file.owner.toString() !== loggedInUser.userId.toString() &&
      !Sharing.findOne({ sharedWith: loggedInUser.userId })
    ) {
      console.log("Unauthorized access");
      return { success: false, message: "Unauthorized access" };
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

const downloadNormalFile = async (fileId, userId) => {
  try {
    const file = await File.findById(fileId);

    if (!file) {
      return {
        success: false,
        message: "File not found",
      };
    }

    console.log("check if exists: ", Sharing.findOne({ sharedWith: userId }));

    if (
      file.owner.toString() !== userId.toString() &&
      !Sharing.findOne({ sharedWith: userId })
    ) {
      return {
        success: false,
        message: "Unauthorized access",
      };
    }

    const fileData = fs.readFileSync(`${file.filePath}/${file.filename}`);

    return {
      data: fileData,
      fileName: file.filename,
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

    files.forEach((file) => {
      file.fileType = getExtensionFromMimeType(file.fileType);
    });

    return files;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while fetching files",
    };
  }
};

// Update share file list
const updateShareList = async (fileId, emails, userId) => {
  try {
    const file = await File.findById(fileId);

    if (!file) {
      return {
        success: false,
        message: "File not found",
      };
    }

    let sharingRecord = await Sharing.findOne({
      file: file._id,
    });

    const userPromises = emails.map(async (email) => {
      const user = await User.findOne({ email });
      if (!user) {
        return {
          success: false,
          message: `User with email ${email} not found`,
        };
      }
      return user._id;
    });

    const users = await Promise.all(userPromises);

    const notFound = users.filter((user) => !user);
    if (notFound.length > 0) {
      return {
        success: false,
        message: `Some users were not found: ${notFound.join(", ")}`,
      };
    }
console.log("Sharing record: ", sharingRecord);
    if (sharingRecord) {
      sharingRecord.sharedWith = users;
      await sharingRecord.save();

      return {
        success: true,
        message: "File shared successfully",
      };
    } else {
      // If no existing share record, create a new one
      console.log("Creating new sharing record");
      sharingRecord = new Sharing({
        file: file._id,
        sharedWIth: users,
        sharedBy: userId,
      });
      await sharingRecord.save();
      return {
        success: true,
        message: "File shared successfully",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while sharing the file",
    };
  }
};

const getSharedFiles = async (userId) => {
  try {
    const sharingRecords = await Sharing.aggregate([
      {
        $match: { sharedWith: new mongoose.Types.ObjectId(userId) },
      },

      // Populate the 'file' and 'sharedBy' fields (optional for aggregation, if needed)
      {
        $lookup: {
          from: "files", // This refers to the 'File' collection
          localField: "file", // The field in 'Sharing' to join on
          foreignField: "_id", // The field in 'File' collection to join on
          as: "fileDetails", // The alias for the populated file details
        },
      },
      {
        $lookup: {
          from: "users", // This refers to the 'User' collection
          localField: "sharedBy", // The field in 'Sharing' to join on
          foreignField: "_id", // The field in 'User' collection to join on
          as: "sharedByDetails", // The alias for the populated user details
        },
      },

      // Unwind the 'fileDetails' and 'sharedByDetails' arrays (they contain only one item)
      { $unwind: "$fileDetails" },
      { $unwind: "$sharedByDetails" },

      // Group by 'sharedBy' and push file details into an array
      {
        $group: {
          _id: "$sharedBy", // Group by 'sharedBy' field
          sharedByDetails: { $first: "$sharedByDetails" }, // Get the details of the 'sharedBy' user
          files: {
            $push: {
              k: "file", // Use the filename as the key
              v: {
                _id: "$fileDetails._id", // Direct reference to _id
                filename: "$fileDetails.filename", // Direct reference to filename
                fileType: "$fileDetails.fileType", // Direct reference to fileType
                filePath: "$fileDetails.filePath", // Direct reference to filePath
                createdAt: "$fileDetails.createdAt", // Direct reference to createdAt
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          sharedBy: {
            _id: "$sharedByDetails._id", // Only include _id
            fullname: "$sharedByDetails.fullname", // Only include fullname
            email: "$sharedByDetails.email", // Only include email
          },
          files: {
            $arrayToObject: "$files", // Convert the array into an object
          },
        },
      },
    ]);

    sharingRecords.forEach((record) => {
      Object.entries(record.files).forEach(([filename, file]) => {
        file.fileType = getExtensionFromMimeType(file.fileType);
      });
    });

    return {
      success: true,
      data: sharingRecords,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while fetching shared files",
    };
  }
};

module.exports = {
  fetchDisplayFiles,
  uploadFile,
  downloadFile,
  downloadNormalFile,
  getFilesByUser,
  updateShareList,
  getSharedFiles,
};
