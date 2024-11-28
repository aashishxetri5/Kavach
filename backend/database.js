const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.CONNECTION_STRING;

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    await mongoose.connect(connectionString);
    isConnected = true;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err; // Ensure errors are propagated
  }
};

// Export the connection function
module.exports = {
  connectToDatabase,
};
