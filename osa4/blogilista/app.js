const express = require("express");
const blogsRouter = require("./controllers/blogs");
const loginRouter = require("./controllers/login");
const testingRouter = require("./controllers/testing");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");

const app = express();

app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

module.exports = app;
