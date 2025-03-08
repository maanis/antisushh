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

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);


app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/post", postsRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
});

module.exports = app;
