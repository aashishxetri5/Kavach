const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = `mongodb://localhost:27017/kavach`;

let isConnected = false; // Track connection status

const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    await mongoose.connect(connectionString);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err; // Ensure errors are propagated
  }
};

// Export the connection function
module.exports = {
  connectToDatabase,
  mongoose,
};
