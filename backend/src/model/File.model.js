const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  encryptedKey: {
    type: String,
    default: null,
  },
  iv: {
    type: String,
    default: null,
  },
  hash: {
    type: String,
    default: null,
  }, //for integrity check
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FileModel = mongoose.model("File", fileSchema);

module.exports = FileModel;
