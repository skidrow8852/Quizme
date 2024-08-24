import { config } from "dotenv";
config();
const express = require("express");
const cors = require("cors");
const app = express();
require("./database/connection");
const admin = require("./routes/admin");
const client = require("./routes/client");
const quizzes = require("./routes/quizzes");
const statement = require("./routes/statement");
const session = require("express-session");
const compression = require("compression");

/// compress request data
app.use(compression({ level: 6, threshold: 0 }));

// Allow client to make requests, and restrict any other requests made from other origins
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Allow to only upload files with 50mb or less
app.use(express.urlencoded({ extended: true, limit: "50mb", parameterLimit: 5000 }));
app.use(express.json({ limit: "50mb" }));

/// Session management

const sess = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
};
// Session management
app.use(session(sess));

/// Routes
app.use("/api/admin", admin);
app.use("/api/client", client);
app.use("/api/quizzes", quizzes);
app.use("/api/statement", statement);

app.use("/uploads", express.static("uploads"));

/// Server listening to requests

const PORT = process.env.PORT || 5000;

const server = require("http").createServer(app);

server.listen(PORT, () => {
  console.log("server is listening");
});

module.exports = app;
