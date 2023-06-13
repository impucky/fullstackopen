const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const { manyBlogs } = require("./test_data");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const newBlogs = manyBlogs.map((blog) => new Blog(blog));

  const promises = newBlogs.map((blog) => blog.save());

  await Promise.all(promises);
});

test("api: blog list returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("api: all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(manyBlogs.length);
});

test("api: all blogs have a 'id' key/value", async () => {
  const response = await api.get("/api/blogs");

  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test("api: a new blog can be added", async () => {
  const prevBlogs = await api.get("/api/blogs");

  const newBlog = {
    title: "I hope I'm a valid blog",
    author: "Pucky",
    url: "http://verycoolblog.com",
    likes: 9,
  };

  const sentBlog = await api.post("/api/blogs").send(newBlog);
  expect(sentBlog.body.title).toContain("I hope I'm a valid blog");

  const nextBlogs = await api.get("/api/blogs");
  expect(nextBlogs.body).toHaveLength(prevBlogs.body.length + 1);
});

test("api: sent blog without likes property is initialized to 0 likes", async () => {
  const newBlog = {
    title: "Please like this blog",
    author: "Pucky",
    url: "http://verycoolblog.com",
  };

  const sentBlog = await api.post("/api/blogs").send(newBlog);

  expect(sentBlog.body.likes).toBe(0);
});

test("api: sent blog with missing title and/or url fails with a 400 status", async () => {
  const firstBlog = {
    author: "Pucky",
    url: "http://verycoolblog.com",
    likes: 42,
  };

  const secondBlog = {
    author: "Pucky",
    title: "I forgot the url",
    likes: 7,
  };

  await api.post("/api/blogs").send(firstBlog).expect(400);
  await api.post("/api/blogs").send(secondBlog).expect(400);
});

afterAll(async () => {
  await mongoose.connection.close();
});
