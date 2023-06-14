const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const { manyBlogs } = require("./helpers");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const newBlogs = manyBlogs.map((blog) => new Blog(blog));
  const promises = newBlogs.map((blog) => blog.save());
  await Promise.all(promises);
});

describe("After initializing some blogs", () => {
  test("Blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("All blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(manyBlogs.length);
  });

  test("All blogs have a 'id' key/value", async () => {
    const response = await api.get("/api/blogs");
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe("Deleting a single blog", () => {
  test("Succeeds with 204 status if the id is valid", async () => {
    const prevBlogs = await api.get("/api/blogs");
    const blogToDelete = prevBlogs.body[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const nextBlogs = await api.get("/api/blogs");
    expect(nextBlogs.body).toHaveLength(manyBlogs.length - 1);

    const titles = nextBlogs.body.map((b) => b.title);

    expect(titles).not.toContain(blogToDelete.title);
  });

  test("Fails with 400 status if id is invalid", async () => {
    await api.delete("/api/blogs/thisisabadidea").expect(400);
  });
});

describe("Adding a new blog", () => {
  //Create new user and login
  let auth;
  beforeAll(async () => {
    await User.deleteMany({});
    const newUser = {
      username: "testuser",
      name: "Test User",
      password: "1234",
    };
    await api.post("/api/users").send(newUser);
    const login = await api.post("/api/login").send(newUser);
    auth = `Bearer ${login.body.token}`;
  });

  test("Succeeds with valid data", async () => {
    const prevBlogs = await api.get("/api/blogs");

    const newBlog = {
      title: "I hope I'm a valid blog",
      author: "Pucky",
      url: "http://verycoolblog.com",
      likes: 9,
    };

    const sentBlog = await api.post("/api/blogs").send(newBlog).set("authorization", auth);
    expect(sentBlog.body.title).toContain("I hope I'm a valid blog");

    const nextBlogs = await api.get("/api/blogs");
    expect(nextBlogs.body).toHaveLength(prevBlogs.body.length + 1);
  });

  test("Initializes to 0 likes if that property is missing", async () => {
    const newBlog = {
      title: "Please like this blog",
      author: "Pucky",
      url: "http://verycoolblog.com",
    };

    const sentBlog = await api.post("/api/blogs").send(newBlog).set("authorization", auth);

    expect(sentBlog.body.likes).toBe(0);
  });

  test("Fails with 400 status if contents are missing", async () => {
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
    const thirdBlog = {};

    await api.post("/api/blogs").send(firstBlog).expect(400);
    await api.post("/api/blogs").send(secondBlog).expect(400);
    await api.post("/api/blogs").send(thirdBlog).expect(400);
  });
});

describe("Updating an existing blog", () => {
  test("Succeeds with 200 status if the id is valid", async () => {
    const prevBlogs = await api.get("/api/blogs");
    const blogToUpdate = prevBlogs.body[0];
    blogToUpdate.title = "Important update!!";

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate).expect(200);

    const nextBlogs = await api.get("/api/blogs");
    expect(nextBlogs.body[0].title).toBe("Important update!!");
  });

  test("Fails with 400 status if id is invalid", async () => {
    await api.put("/api/blogs/thisisabadidea").expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
