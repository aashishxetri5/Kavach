const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const secret = process.env.SESSION_SECRET;
const connectionString = process.env.CONNECTION_STRING;

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
  credentials: true,
  allowedHeaders: "Content-Type, Authorization",
  exposedHeaders: "Content-Range, X-Content-Range",
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Routes
const routes = require("./src/routes");
app.use("/", routes);

module.exports = app; // Export the raw app
