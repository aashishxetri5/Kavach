const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["ADMIN", "EMPLOYEE"],
    required: true,
  },
  profilePic: {
    type: String,
    default: function () {
      return `https://ui-avatars.com/api/?name=${this.fullname}&background=e74c3c&color=f0f3f4&bold=true`;
    },
  },
  joined_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
