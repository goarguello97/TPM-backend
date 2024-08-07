import request from "supertest";
import { app } from "../api/server";
import dotenv from "dotenv";
import User from "../api/models/User";
import Match from "../api/models/Match";

dotenv.config();

process.env.NODE_ENV = "test";

beforeAll(async () => {
  await Promise.all([
    app.locals.connectDB,
    User.deleteMany({}),
    Match.deleteMany({}),
  ]);
});

afterAll(async () => {
  await Promise.all([User.deleteMany({}), Match.deleteMany({})]);
});

xdescribe("POST /match/send", () => {
  let randomId = "507f1f77bcf86cd799439011";
  let idUserA = "" as string;
  let idUserB = "" as string;
  beforeAll(async () => {
    const [_, A, B] = await Promise.all([
      User.deleteMany({}),
      User.create({
        username: "fulanito",
        email: "fulano@lapeds.com",
        password: "Pass-1234",
      }),
      User.create({
        username: "menganito",
        email: "mengano@lapeds.com",
        password: "Pass-1234",
      }),
    ]);
    idUserA = A._id.toString();
    idUserB = B._id.toString();
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  xit("should cannot send match request if some user not exist", async () => {
    const response = await request(app)
      .post("/api/match/send")
      .send({ idUser: randomId, idUserToMatch: idUserA });

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("No existe uno de los usuarios.");
  });

  xit("should cannot send match request if some id is undefined or null", async () => {
    const response = await request(app)
      .post("/api/match/send")
      .send({ idUser: undefined, idUserToMatch: idUserA });

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "No a ingresado el id correspondiente."
    );
  });

  xit("A match request should not be sent if any id is undefined or null.(reversed)", async () => {
    const response = await request(app)
      .post("/api/match/send")
      .send({ idUser: idUserA, idUserToMatch: undefined });

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "No a ingresado el id correspondiente."
    );
  });

  it("should send match successfully", async () => {
    const response = await request(app)
      .post("/api/match/send")
      .send({ idUser: idUserA, idUserToMatch: idUserB });

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Solicitud enviada.");

    const [userA, userB] = await Promise.all([
      User.findById(idUserA),
      User.findById(idUserB),
    ]);

    expect(userA?.matchSend.some((id) => id.equals(idUserB))).toBe(true);
    expect(userB?.matchReq.some((id) => id.equals(idUserA))).toBe(true);
  });
});

describe("POST /match/response", () => {
  let randomId = "507f1f77bcf86cd799439011";
  let idUserA = "" as string;
  let idUserB = "" as string;
  beforeAll(async () => {
    const [_, A, B] = await Promise.all([
      User.deleteMany({}),
      User.create({
        username: "fulanito",
        email: "fulano@lapeds.com",
        password: "Pass-1234",
      }),
      User.create({
        username: "menganito",
        email: "mengano@lapeds.com",
        password: "Pass-1234",
      }),
    ]);
    idUserA = A._id.toString();
    idUserB = B._id.toString();
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  xit("should cannot response request if not exist some id", async () => {
    const response = await request(app)
      .post("/api/match/response")
      .send({ idReceivingUser: undefined, response: true });

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "No a ingresado el id correspondiente."
    );
  });

  xit("should cannot response request if not exist response", async () => {
    const response = await request(app)
      .post("/api/match/response")
      .send({ idReceivingUser: idUserA });

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("No existe respuesta");
  });

  xit("should cannot response request if not exist some id or response", async () => {
    const response = await request(app).post("/api/match/response").send({});

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("No existen argumentos válidos.");
  });

  xit("should accept request successfully", async () => {
    const sendRequest = await request(app)
      .post("/api/match/send")
      .send({ idUser: idUserA, idUserToMatch: idUserB });

    expect(sendRequest.status).toBe(200);

    const response = await request(app)
      .post("/api/match/response")
      .send({ idReceivingUser: idUserB, response: true });

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Match aceptado correctamente.");
  });

  it("should deny request successfully", async () => {
    const sendRequest = await request(app)
      .post("/api/match/send")
      .send({ idUser: idUserA, idUserToMatch: idUserB });

    expect(sendRequest.status).toBe(200);

    const response = await request(app)
      .post("/api/match/response")
      .send({ idReceivingUser: idUserB, response: false });

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Match rechazado correctamente.");
  });
});
