import request from "supertest";
import app from "../../src/app";

export async function createPatient(
  token: string,
  data = {
    name: "Maria",
    email: "maria@test.com",
    password: "123456",
  }
) {
  return request(app)
    .post("/patients")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send(data);
}