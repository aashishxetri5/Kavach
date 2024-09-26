const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const fileUpload = require("express-fileupload");
require("dotenv").config(); // Load environment variables from .env file

const { connectToDatabase } = require("./database");

const secret = process.env.SESSION_SECRET;
const port = process.env.PORT || 3001;

const connectionString = "mongodb://localhost:27017/kavach";

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

app.set("views", path.join(__dirname, "src", "views")); //Setting the path of views to src/views
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "src", "public"))); //For static files like CSS and client-side JS

// Session middleware
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: connectionString,
    }),
    cookie: { maxAge: 120 * 60 * 1000 }, // 3 hours
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to handle file uploads
app.use(fileUpload());

// Routes
const routes = require("./src/routes");
app.use("/", routes);

// Middleware for handling 404 errors
app.use(function (err, req, res, next) {
  res.status(404).render("pageNotFound");
});

// Middleware for handling 500 errors
app.use(function (err, req, res, next) {
  res.status(500).render("serverError");
});
