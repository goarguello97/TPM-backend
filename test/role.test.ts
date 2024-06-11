import request from "supertest";
import { app, server } from "../api/server";

afterAll((done) => {
    server.close(done);
  });

describe("GET /role", () => {
  it("should return a list of roles", async () => {
    const roles = await request(app).get("/api/role");
    expect(roles.body[0].role).toEqual("MENTEE");
    expect(roles.body.length).toEqual(3);
  });
});
