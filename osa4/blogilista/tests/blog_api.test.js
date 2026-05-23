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

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

before(async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.MONGODB_URI, { family: 4 });
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("emma", 10);
  const user = new User({
    username: "emma",
    name: "Emma",
    passwordHash,
  });
  await user.save();

  await Blog.insertMany(initialBlogs);
});

const getToken = async () => {
  const response = await api
    .post("/api/login")
    .send({ username: "emma", password: "emma" });

  return response.body.token;
};

describe("blogs API", { concurrency: false }, () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test("unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");

    assert(response.body[0].id);
    assert.strictEqual(response.body[0]._id, undefined);
  });

  test("a valid blog can be added", async () => {
    const token = await getToken();
    const newBlog = {
      title: "Async/Await cleans up controller tests",
      author: "Test Author",
      url: "https://example.com/async-await",
      likes: 4,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const titles = response.body.map((blog) => blog.title);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);
    assert(titles.includes("Async/Await cleans up controller tests"));
  });

  test("a blog cannot be added without a token", async () => {
    const newBlog = {
      title: "Token is required",
      author: "Test Author",
      url: "https://example.com/token",
      likes: 4,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test("the token owner is set as the creator of a new blog", async () => {
    const token = await getToken();
    const newBlog = {
      title: "Created by token owner",
      author: "Test Author",
      url: "https://example.com/token-owner",
      likes: 3,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const user = await User.findOne({ username: "root" });
    assert.strictEqual(response.body.user, String(user._id));
  });

  test("added blog includes creator information in the blog list", async () => {
    const token = await getToken();
    const newBlog = {
      title: "Populate makes users visible",
      author: "Test Author",
      url: "https://example.com/populate",
      likes: 6,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog);

    const response = await api.get("/api/blogs");
    const addedBlog = response.body.find(
      (blog) => blog.title === newBlog.title,
    );

    assert.strictEqual(addedBlog.user.username, "emma");
    assert.strictEqual(addedBlog.user.name, "Superuser");
  });

  test("a blog can be deleted", async () => {
    const blogsAtStart = await api.get("/api/blogs");
    const blogToDelete = blogsAtStart.body[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await api.get("/api/blogs");
    const titles = blogsAtEnd.body.map((blog) => blog.title);

    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1);
    assert(!titles.includes(blogToDelete.title));
  });
});

after(async () => {
  await mongoose.connection.close();
});
