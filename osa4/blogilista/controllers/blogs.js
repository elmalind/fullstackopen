const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const config = require("../utils/config");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: "token missing" });
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(request.token, config.SECRET);
  } catch (error) {
    return response.status(401).json({ error: "token invalid" });
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(401).json({ error: "token invalid" });
  }

  const blog = new Blog({
    ...request.body,
    user: user._id,
  });

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
    context: "query",
  }).populate("user", { username: 1, name: 1 });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
