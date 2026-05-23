process.env.NODE_ENV = "test";

const { test, describe, before, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const config = require("../utils/config");

const api = supertest(app);

before(async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.MONGODB_URI, { family: 4 });
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
});

describe("users API", { concurrency: false }, () => {
  test("a user can be created", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: "emma",
      name: "emma",
      password: "emma",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
    assert.strictEqual(usersAtEnd[0].username, newUser.username);
  });

  test("users are returned as json", async () => {
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "mluukkai",
      name: "Matti Luukkainen",
      passwordHash,
    });
    await user.save();

    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.length, 1);
    assert.strictEqual(response.body[0].username, "mluukkai");
  });

  test("password is not returned or stored as plain text", async () => {
    const newUser = {
      username: "safeuser",
      name: "Safe User",
      password: "sekret",
    };

    const response = await api.post("/api/users").send(newUser).expect(201);
    const savedUser = await User.findOne({ username: newUser.username });

    assert.strictEqual(response.body.password, undefined);
    assert.strictEqual(response.body.passwordHash, undefined);
    assert.notStrictEqual(savedUser.passwordHash, newUser.password);
    assert(await bcrypt.compare(newUser.password, savedUser.passwordHash));
  });

  test("users include their added blogs", async () => {
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "blogowner",
      name: "Blog Owner",
      passwordHash,
    });
    const savedUser = await user.save();

    const blog = new Blog({
      title: "Visible in user listing",
      author: "Test Author",
      url: "https://example.com/user-blogs",
      likes: 2,
      user: savedUser._id,
    });
    const savedBlog = await blog.save();

    savedUser.blogs = savedUser.blogs.concat(savedBlog._id);
    await savedUser.save();

    const response = await api.get("/api/users");
    const userFromResponse = response.body.find(
      (userInResponse) => userInResponse.username === "blogowner",
    );

    assert.strictEqual(userFromResponse.blogs.length, 1);
    assert.strictEqual(userFromResponse.blogs[0].title, "Visible in user listing");
  });
});

after(async () => {
  await mongoose.connection.close();
});
