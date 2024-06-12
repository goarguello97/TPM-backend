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
});

describe("POST /users", () => {
  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should not create a user if there are missing fields.(email)", async () => {
    const user = {
      username: "fulanito",
      password: "Pass-1234",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El correo electrónico es obligatorio.');
  });

  it("should not create a user if there are missing fields.(password)", async () => {
    const user = {
      username: "fulanito",
      email: "email@email.com",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("La contraseña es requerida.");
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
});
