const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activityLogSchema = new Schema({
  action: {
    type: String,
    required: true,
  }, // e.g., 'upload', 'download', 'decrypt', 'login'
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  file: {
    type: Schema.Types.ObjectId,
    ref: "File",
    required: false,
  }, // For actions related to files - optional
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
    required: false,
  }, // Additional info about the action
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
module.exports = ActivityLog;
