const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const allBlogs = await Blog.find({});
  response.json(allBlogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const queriedBlog = await Blog.findById(request.params.id);
  if (queriedBlog) {
    response.json(queriedBlog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const newBlog = new Blog(request.body);

  if (!newBlog.likes) newBlog.likes = 0;

  if (!newBlog.author || !newBlog.title || !newBlog.url) {
    response.status(400).end();
  } else {
    const savedBlog = await newBlog.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true });
  if (updatedBlog) {
    response.status(200).json(updatedBlog);
  } else {
    response.status(400).end();
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const deletedBlog = await Blog.findByIdAndRemove(request.params.id);
  if (deletedBlog) {
    response.status(204).end();
  } else {
    response.status(400).end();
  }
});

module.exports = blogsRouter;
