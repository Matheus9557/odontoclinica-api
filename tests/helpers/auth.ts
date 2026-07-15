import request from "supertest";
import app from "../../src/app";

export async function createDentistAndLogin() {

  const signup = await request(app)
    .post("/auth/signup/dentist")
    .send({
      name: "Dr João",
      email: "joao@test.com",
      password: "123456",
      cro: "123456-PB",
    });


  console.log("SIGNUP STATUS:", signup.status);
  console.log("SIGNUP BODY:", signup.body);


  const login = await request(app)
    .post("/auth/login")
    .send({
      email: "joao@test.com",
      password: "123456",
      role: "dentist",
    });


  console.log("LOGIN STATUS:", login.status);
  console.log("LOGIN BODY:", login.body);


  return login.body.token as string;
}