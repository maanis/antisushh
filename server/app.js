require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose_connection = require("./config/mongoose-config");
var cors = require("cors");
var session = require("express-session");

var indexRouter = require("./routes/index");
var postsRouter = require("./routes/post");
var usersRouter = require("./routes/user");
const { connection } = require("mongoose");

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ CORS Configuration (Ensure Credentials are Allowed)
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"], // Ensures frontend can read cookies
};
app.use(cors(corsOptions));

app.use(express.json());

// ✅ Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // Change this to a secure key
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // Prevents XSS attacks
      secure: false, // Set to `true` if using HTTPS
      sameSite: "lax", // Allows cross-origin authentication
      maxAge: 1000 * 60 * 60 * 24, // 1-day expiration
    },
  })
);

// ✅ Debugging Middleware: Check if session is working
app.use((req, res, next) => {
  console.log("Session Data:", req.session);
  next();
});

// Routes
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/post", postsRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
});

module.exports = app;
