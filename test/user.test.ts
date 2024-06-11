import request from "supertest";
import { app } from "../api/server";
import dotenv from "dotenv";
import User from "../api/models/User";

dotenv.config();

process.env.NODE_ENV = "test";

beforeAll(async () => {
  await app.locals.connectDB;
});

afterAll(async () => {
  await User.deleteMany({});
});

describe("GET /users", () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should have no users initially", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should create a user", async () => {
    const user = {
      username: "fulanito",
      email: "email@email.com",
      password: "Pass-1234",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(201);
    expect(response.body.username).toBe("fulanito");
  });

  it("should verify user creation", async () => {
    const user = {
      username: "fulanito",
      email: "email@email.com",
      password: "Pass-1234",
    };
    await new User(user).save();
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].username).toBe("fulanito");
  });
});
