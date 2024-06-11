import request from "supertest";
import { app } from "../api/server";
import dotenv from "dotenv";

dotenv.config();

process.env.NODE_ENV = "test";

describe("GET /role", () => {
  it("should return a list of roles", async () => {
    const response = await request(app).get("/api/role");
    const roles = response.body;
    expect(response.status).toBe(200);
    expect(Array.isArray(roles)).toBe(true);
    expect(
      roles.some(
        (role: {
          _id: string;
          role: string;
          createdAt: Date;
          updatedAt: Date;
        }) => role.role === "MENTEE"
      )
    ).toBe(true);
    expect(roles.length).toEqual(3);
  });
});
