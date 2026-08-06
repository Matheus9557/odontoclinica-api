import request from "supertest";
import app from "../../src/app";

export async function createDentistAndLogin() {
  await request(app)
    .post("/auth/signup/dentist")
    .send({
      name: "Dr João",
      email: "joao@test.com",
      password: "123456",
      cro: "123456-PB",
    });

  const login = await request(app)
    .post("/auth/login")
    .send({
      email: "joao@test.com",
      password: "123456",
      role: "dentist",
    });

  return login.body.token as string;
}