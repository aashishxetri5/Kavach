const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activityLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
  }, // e.g., 'upload', 'download', 'decrypt', 'login', etc.
  target: {
    type: String,
    required: false,
  }, // For actions related to files - optional
  details: {
    type: String,
    required: false,
  }, // Additional info about the action
  timestamp: {
    type: Date,
    default: Date.now,
  },
  expiresAt: { type: Date, required: true }, // Expiry field
});

activityLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
module.exports = ActivityLog;
