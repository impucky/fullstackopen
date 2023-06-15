const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");

const Blog = require("../models/blog");
const User = require("../models/user");

const { tokenExtractor, userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const allBlogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(allBlogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const queriedBlog = await Blog.findById(request.params.id);

  if (!queriedBlog) return response.status(404).end();

  response.json(queriedBlog);
});

blogsRouter.post("/", tokenExtractor, userExtractor, async (request, response) => {
  const user = request.user;

  const newBlog = new Blog(request.body);
  newBlog.user = user._id;

  if (!newBlog.likes) newBlog.likes = 0;

  if (!newBlog.author || !newBlog.title || !newBlog.url) {
    return response.status(400).json({ error: "Missing fields" });
  }

  user.blogs = user.blogs.concat(newBlog._id);
  await user.save();
  const savedBlog = await newBlog.save();
  response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true });

  if (!updatedBlog) return response.status(400).end();

  response.status(200).json(updatedBlog);
});

blogsRouter.delete("/:id", tokenExtractor, userExtractor, async (request, response) => {
  const user = request.user;
  const blogToDelete = await Blog.findById(request.params.id);

  // workaround for test data having no assigned user
  if (!blogToDelete.user) return response.status(401).end();

  if (blogToDelete.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: "User doesn't own this entry" });
  }

  const deletedBlog = await Blog.findByIdAndRemove(request.params.id);

  if (!deletedBlog) return response.status(400).end();

  response.status(204).end();
});

module.exports = blogsRouter;
