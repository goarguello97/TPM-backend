import request from "supertest";
import "jest-localstorage-mock";
import { app } from "../api/server";
import dotenv from "dotenv";
import User from "../api/models/User";
import Role from "../api/models/Role";
import { IUser } from "../api/interfaces/IUser";
import FirebaseService from "../api/services/FirebaseServices";

dotenv.config();

process.env.NODE_ENV = "test";

beforeAll(async () => {
  await app.locals.connectDB;
  await User.deleteMany();
});

afterAll(async () => {
  await User.deleteMany({});
});

xdescribe("GET /users/:id", () => {
  let id = "" as string;
  let username = "" as string;
  let unknowId = "507f1f77bcf86cd799439011" as string;
  beforeAll(async () => {
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

xdescribe("GET /users", () => {
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

xdescribe("POST /users", () => {
  beforeAll(async () => {
    await Promise.all([User.deleteMany({}), FirebaseService.deteleAllUsers()]);
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

xdescribe("PUT /users", () => {
  let id = "" as string;
  let randomId = "507f1f77bcf86cd799439011";
  let username = "" as string;

  beforeAll(async () => {
    await User.deleteMany({});
    const user = await User.create({
      username: "fulanito",
      email: "haxine1712@lapeds.com",
      password: "Pass-1234",
    });

    id = user._id.toString();
    username = user.username;
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should modify their name of original user", async () => {
    const user = { username: "cosme" };

    const response = await request(app).put(`/api/users/${id}`).send(user);
    expect(response.status).toBe(200);
    expect(response.body.username).toEqual("cosme");
  });

  it("should modify their email of original user", async () => {
    const user = { email: "cambio@email.com" };

    const response = await request(app).put(`/api/users/${id}`).send(user);
    expect(response.status).toBe(200);
    expect(response.body.email).toEqual("cambio@email.com");
  });

  it("should cannot modify their username for incorrect id", async () => {
    const user = { username: "cosme" };

    const response = await request(app)
      .put(`/api/users/${randomId}`)
      .send(user);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado.");
  });
});

xdescribe("DELETE /users", () => {
  let userAdmin: IUser;
  let userMentor: IUser;
  let randomUser: IUser;
  let randomId = "507f1f77bcf86cd799439011";
  beforeAll(async () => {
    await User.deleteMany({});
    const adminRole = await Role.findOne({ role: "ADMIN" });
    const mentorRole = await Role.findOne({ role: "MENTOR" });
    const userToAdmin = {
      username: "admin",
      email: "admin@admin.com",
      password: "Pass-1234",
      role: adminRole?._id,
    };
    const userToMentor = {
      username: "mentor",
      email: "mentor@mentor.com",
      password: "Pass-1234",
      role: mentorRole?._id,
    };
    const userToRandom = {
      username: "fulanito",
      email: "haxine1712@lapeds.com",
      password: "Pass-1234",
    };
    userAdmin = await User.create(userToAdmin);
    userMentor = await User.create(userToMentor);
    randomUser = await User.create(userToRandom);
  });

  it("should cannot delete user if the role is not specified", async () => {
    const response = await request(app)
      .delete("/api/users")
      .send({ idAdmin: randomId, idUserToDelete: randomUser._id });

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Rol no especifícado.");
  });

  it("should cannot delete user if the role not corresponding an admin", async () => {
    const response = await request(app)
      .delete("/api/users")
      .send({ idAdmin: userMentor._id, idUserToDelete: randomUser._id });

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("No posees los permisos necesarios.");
  });

  it("should delete user if an admin id is provided", async () => {
    const response = await request(app)
      .delete("/api/users")
      .send({ idAdmin: userAdmin._id, idUserToDelete: randomUser._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(
      "Usuario eliminado satisfacoriamente."
    );
  });
});

xdescribe("POST /login", () => {
  let id = "" as string;
  let randomId = "507f1f77bcf86cd799439011";
  let username = "" as string;

  beforeAll(async () => {
    await User.deleteMany({});
    const user = await User.create({
      username: "fulanito",
      email: "haxine1712@lapeds.com",
      password: "Pass-1234",
    });

    id = user._id.toString();
    username = user.username;
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  xit("should successfully login", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "haxine1712@lapeds.com", password: "Pass-1234" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("email", "haxine1712@lapeds.com");
  });

  xit("should cannot login with incorrect credentials(email)", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "fulano@lapeds.com", password: "Pass-1234" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Credenciales inválidas.");
  });

  xit("should cannot login with incorrect credentials(password)", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "haxine1712@lapeds.com", password: "Pass-12345" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Credenciales inválidas.");
  });

  xit("should verify persistence login", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "haxine1712@lapeds.com", password: "Pass-1234" });

    expect(response.status).toBe(200);

    const localStorageToken = localStorage.getItem("firebaseToken");

    expect(localStorageToken).toBeTruthy();
    expect(localStorageToken).toBe(response.body.token);
  });

  it("should successfully logout", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "haxine1712@lapeds.com", password: "Pass-1234" });

    expect(response.status).toBe(200);

    const logout = await request(app).post("/api/users/logout");
    const localStorageToken = localStorage.getItem("firebaseToken");
    expect(logout.status).toBe(200);
    expect(logout.body.message).toEqual("Sesión cerrada correctamente.");
    expect(localStorageToken).toBeFalsy();
  });
});

xdescribe("get /users/verify/:token", () => {
  beforeEach(async () => {
    await Promise.all([User.deleteMany({}), FirebaseService.deteleAllUsers()]);
  });

  afterAll(async () => {
    await Promise.all([User.deleteMany({}), FirebaseService.deteleAllUsers()]);
  });

  xit("should not be verified when registering", async () => {
    const user = {
      username: "fulanito",
      email: "haxine1712@lapeds.com",
      password: "Pass-1234",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(201);

    const userCreated = await User.findById(response.body._id);

    expect(userCreated).toHaveProperty("verify", false);
  });

  xit("should receive a token to verify", async () => {
    const user = {
      username: "fulanito",
      email: "haxine1712@lapeds.com",
      password: "Pass-1234",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  xit("should verify user with token", async () => {
    const user = {
      username: "fulanito",
      email: "haxine1712@lapeds.com",
      password: "Pass-1234",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(201);
    const { token } = response.body;
    const verifyUser = await request(app).get(`/api/users/verify/${token}`);

    expect(verifyUser.status).toBe(200);
    expect(verifyUser.body.message).toEqual(
      "Usuario verificado correctamente."
    );

    const userToVerificate = await User.findById(response.body._id);

    expect(userToVerificate).toHaveProperty("verify", true);
  });

  it("should cannot verify user with invalid token", async () => {
    const user = {
      username: "fulanito",
      email: "haxine1712@lapeds.com",
      password: "Pass-1234",
    };
    const randomToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiZnVsYW5pdG8iLCJlbWFpbCI6ImhheGluZTE3MTJAbGFwZWRzLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDZDVW5PamRzdHg3dFVDVW5mWGNCeWVkNUtGL2toaWhSNlBFQUJpWjdyWlg5R0IyL0ZUYzcuIiwibWVudG9yIjpbXSwibWQiOltdLCJtYXRjaFJlcSI6W10sIm1hdGNoU2VuZCI6W10sIm1hdGNoIjpbXSwidmVyaWZ5IjpmYWxzZSwic2tpbGxzIjpbXSwiYXZhdGFyIjoiNjY2ZDE4OTBhNjU1MWIyODFhOWRjZTUxIiwidG9rZW5SZWNvdmVyIjoiIiwiX2lkIjoiNjY4OWU2NWQ2OTBmOTY0YTBjY2I2YzljIn0sImlhdCI6MTcyMDMxMzQzNywiZXhwIjoxNzIwMzQ5NDM3fQ.nQIvImjb39Kz44sM_EydE9RCJdc0G8Q_kzqoTXwLExA";
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(201);

    const verifyUser = await request(app).get(
      `/api/users/verify/${randomToken}`
    );

    expect(verifyUser.status).toBe(404);
    expect(verifyUser.body.message).toEqual("Token inválido.");
  });
});

xdescribe("POST /users/recover-pass", () => {
  beforeEach(async () => {
    await Promise.all([User.deleteMany({}), FirebaseService.deteleAllUsers()]);
  });

  afterAll(async () => {
    await Promise.all([User.deleteMany({}), FirebaseService.deteleAllUsers()]);
  });

  xit("should cannot recover pass if user not exists", async () => {
    const response = await request(app)
      .post("/api/users/recover-pass")
      .send({ email: "fikiw28652@cartep.com" });

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Usuario no existe.");
  });

  it("should recover pass if user exists", async () => {
    const user = {
      username: "fulanito",
      email: "fikiw28652@cartep.com",
      password: "Pass-1234",
    };
    const userCreated = await request(app).post("/api/users").send(user);
    expect(userCreated.status).toBe(201);

    const response = await request(app)
      .post("/api/users/recover-pass")
      .send({ email: "fikiw28652@cartep.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(
      "Revise su correo electrónico porfavor."
    );
  });
});

xdescribe("GET /users/authorize/change-pass/:token", () => {
  beforeEach(async () => {
    await Promise.all([User.deleteMany({}), FirebaseService.deteleAllUsers()]);
  });

  afterAll(async () => {
    await Promise.all([User.deleteMany({}), FirebaseService.deteleAllUsers()]);
  });

  xit("should cannot enable change password if token not valid", async () => {
    const randomToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiZnVsYW5pdG8iLCJlbWFpbCI6ImhheGluZTE3MTJAbGFwZWRzLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDZDVW5PamRzdHg3dFVDVW5mWGNCeWVkNUtGL2toaWhSNlBFQUJpWjdyWlg5R0IyL0ZUYzcuIiwibWVudG9yIjpbXSwibWQiOltdLCJtYXRjaFJlcSI6W10sIm1hdGNoU2VuZCI6W10sIm1hdGNoIjpbXSwidmVyaWZ5IjpmYWxzZSwic2tpbGxzIjpbXSwiYXZhdGFyIjoiNjY2ZDE4OTBhNjU1MWIyODFhOWRjZTUxIiwidG9rZW5SZWNvdmVyIjoiIiwiX2lkIjoiNjY4OWU2NWQ2OTBmOTY0YTBjY2I2YzljIn0sImlhdCI6MTcyMDMxMzQzNywiZXhwIjoxNzIwMzQ5NDM3fQ.nQIvImjb39Kz44sM_EydE9RCJdc0G8Q_kzqoTXwLExA";
    const response = await request(app).get(
      `/api/users/authorize/change-pass/${randomToken}`
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Token inválido.");
  });

  it("should enable change password if token is valid", async () => {
    const user = {
      username: "fulanito",
      email: "fikiw28652@cartep.com",
      password: "Pass-1234",
    };
    const userCreated = await request(app).post("/api/users").send(user);
    expect(userCreated.status).toBe(201);

    const recoveryPassRequest = await request(app)
      .post("/api/users/recover-pass")
      .send({ email: user.email });

    expect(recoveryPassRequest.status).toBe(200);

    const response = await request(app).get(
      `/api/users/authorize/change-pass/${recoveryPassRequest.body.token}`
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Autorizado a modificar.");
  });
});

describe("PATCH /users/change-pass", () => {
  beforeEach(async () => {
    await Promise.all([User.deleteMany({}), FirebaseService.deteleAllUsers()]);
  });

  afterAll(async () => {
    await Promise.all([User.deleteMany({}), FirebaseService.deteleAllUsers()]);
  });

  it("should cannot change pass if user not exists", async () => {
    const response = await request(app)
      .patch("/api/users/change-pass")
      .send({ email: "fikiw28652@cartep.com", password: "Pass-123456" });

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Usuario no existe.");
  });

  it("should change pass succesfully", async () => {
    const user = {
      username: "fulanito",
      email: "fikiw28652@cartep.com",
      password: "Pass-1234",
    };
    const userCreated = await request(app).post("/api/users").send(user);
    expect(userCreated.status).toBe(201);

    const response = await request(app)
      .patch("/api/users/change-pass")
      .send({ email: "fikiw28652@cartep.com", password: "Pass-123456" });

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(
      "Contraseña modificada exitosamente."
    );
  });
});
