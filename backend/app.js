const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const fileUpload = require("express-fileupload");
require("dotenv").config(); // Load environment variables from .env file

const { connectToDatabase } = require("./database");

const secret = process.env.SESSION_SECRET;
const port = process.env.PORT;
const connectionString = process.env.CONNECTION_STRING;

// Initialize database connection
(async function initializeApp() {
  try {
    await connectToDatabase(); // Connect to MongoDB

    // Start the server after the connection is established
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  } catch (err) {
    console.error("Failed to initialize the application:", err);
    process.exit(1); // Exit process if initialization fails
  }
})();

// Session middleware
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: connectionString,
    }),
    cookie: { maxAge: 120 * 60 * 1000 }, // 2 hours
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for flash messages
app.use(flash());

// Middleware to handle file uploads
app.use(fileUpload());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // enable set cookie
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Routes
const routes = require("./src/routes");
app.use("/", routes);
