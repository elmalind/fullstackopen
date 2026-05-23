process.env.NODE_ENV = "test";

const { test, describe, before, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const config = require("../utils/config");

const api = supertest(app);

before(async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.MONGODB_URI, { family: 4 });
});

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({
    username: "root",
    name: "Superuser",
    passwordHash,
  });

  await user.save();
});

describe("login API", { concurrency: false }, () => {
  test("login succeeds with valid credentials", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert(response.body.token);
    assert.strictEqual(response.body.username, "root");
    assert.strictEqual(response.body.name, "Superuser");
  });

  test("login fails with invalid password", async () => {
    await api
      .post("/api/login")
      .send({ username: "root", password: "wrong-password" })
      .expect(401);
  });
});

after(async () => {
  await mongoose.connection.close();
});
