const app = require("./app");
const { connectToDatabase } = require("./database");
require("dotenv").config();

const port = process.env.PORT || 5000;

(async function initializeServer() {
  try {
    await connectToDatabase(); // Connect to the database
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  } catch (err) {
    console.error("Failed to initialize the application:", err);
    process.exit(1);
  }
})();
