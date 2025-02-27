require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose_connection = require("./config/mongoose-config");
var cors = require('cors')

var indexRouter = require("./routes/index");
var postsRouter = require("./routes/post");
var usersRouter = require("./routes/user");
const { connection } = require("mongoose");

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
}
app.use(cors(corsOptions))
app.use(express.json());

// Routes
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/post", postsRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler (✅ Fix: Remove res.render)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500
    }
  });
});

module.exports = app;
