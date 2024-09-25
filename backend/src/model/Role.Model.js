const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  roleName: {
    type: String,
    enum: ["admin", "employee"],
    required: true,
  },
});

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
