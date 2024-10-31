const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
  },
  fileType: {
    type: String,
  },
  filePath: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  encryptedKey: {
    type: String,
    required: false,
  },
  hash: {
    type: String,
    required: true,
  }, //for integrity check
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FileModel = mongoose.model("File", fileSchema);

module.exports = FileModel;
