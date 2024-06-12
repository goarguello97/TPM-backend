import request from "supertest";
import { app } from "../api/server";
import dotenv from "dotenv";
import User from "../api/models/User";
import { ObjectId } from "mongoose";

dotenv.config();

process.env.NODE_ENV = "test";

beforeAll(async () => {
  await app.locals.connectDB;
});

afterAll(async () => {
  await User.deleteMany({});
});

describe("GET /users/:id", () => {
  let id = "" as string;
  let username = "" as string;
  let unknowId = "507f1f77bcf86cd799439011" as string;
  beforeEach(async () => {
    const user = await User.create({
      username: "fulanito",
      email: "haxine1712@lapeds.com",
      password: "Pass-1234",
    });

    id = user._id.toString();
    username = user.username;
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should find a user by id", async () => {
    const response = await request(app).get(`/api/users/${id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", id);
    expect(response.body).toHaveProperty("username", username);
  });

  it("should not find a user by incorrect id", async () => {
    const response = await request(app).get(`/api/users/${unknowId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado.");
  });
});

describe("GET /users", () => {
  it("should have no users initially", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should have a one user when register a user", async () => {
    await User.create({
      username: "fulanito",
      email: "haxine1712@lapeds.com",
      password: "Pass-1234",
    });
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it("should have a two users when register a other user", async () => {
    await User.create({
      username: "fulanito2",
      email: "haxine17122@lapeds.com",
      password: "Pass-1234",
    });
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});

describe("POST /users", () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  it("should not create a user if there are missing fields.(email)", async () => {
    const user = {
      username: "fulanito",
      password: "Pass-1234",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("El correo electrónico es obligatorio.");
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
      email: "haxine1712@lapeds.com",
      password: "Pass-1234",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(201);
    expect(response.body.username).toBe("fulanito");
  });

  it("should not create a user if username already exists", async () => {
    const user = {
      username: "fulanito",
      email: "haxine1712@lapeds.com",
      password: "Pass-1234",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe(
      "El nombre de usuario fulanito actualmente está en uso."
    );
  });

  it("should not create a user if email already exists", async () => {
    const user = {
      username: "fulanito2",
      email: "haxine1712@lapeds.com",
      password: "Pass-1234",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe(
      "El correo electrónico haxine1712@lapeds.com actualmente está en uso."
    );
  });
});
