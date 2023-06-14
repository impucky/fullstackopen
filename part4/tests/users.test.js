const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

describe("When there is initially one user in the collection", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("shhhh", 10);
    const user = new User({ username: "pucky", name: "Pucky Pucky", passwordHash });

    await user.save();
  });

  test("Creation succeeds with a fresh username", async () => {
    const prevUsers = await api.get("/api/users");

    const newUser = {
      username: "hallo",
      name: "Hal Lo",
      password: "1234",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const nextUsers = await api.get("/api/users");
    expect(nextUsers.body).toHaveLength(prevUsers.body.length + 1);

    const usernames = nextUsers.body.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("Creation fails with a non-unique username", async () => {
    const newUser = {
      username: "pucky",
      name: "Puc Ky",
      password: "1234",
    };
    await api.post("/api/users").send(newUser).expect(400);
  });

  test("Creation fails with missing or invalid fields", async () => {
    await api.post("/api/users").send({ username: "a" }).expect(400);
    await api.post("/api/users").send({ username: "abcd", password: "12" }).expect(400);
    await api.post("/api/users").send({ username: "cooldude123", password: "secret" }).expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
