require("events").EventEmitter.defaultMaxListeners = 20; // Set the maximum number of listeners to 20
const app = require("./app");
const { connectToDatabase } = require("./database");
require("dotenv").config();

const ActivityLog = require("./src/services/Activity.service");
const http = require("http").createServer(app);
const socketio = require("socket.io");

const io = socketio(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    allowHeaders: ["Content-Type"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  ActivityLog.sendAllLogs(socket);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

http.listen(5001, () => {
  console.log("Server running on port 5001");
});

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
