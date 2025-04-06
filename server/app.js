require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose_connection = require("./config/mongoose-config");
var cors = require("cors");
var session = require("express-session");
var path = require('path')

var indexRouter = require("./routes/index");
var postsRouter = require("./routes/post");
var usersRouter = require("./routes/user");
var chatRouter = require("./routes/chat");
const { connection } = require("mongoose");
const { app } = require("./socket/socket.io");

// var app = express();

console.log(__dirname)

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.URL,
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
app.use("/chat", chatRouter);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
})

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
