import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { cleanDatabase } from "../helpers/database";

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});


describe("Auth Integration Tests", () => {

  it("POST /auth/signup/dentist should create a dentist in database", async () => {

    const response = await request(app)
      .post("/auth/signup/dentist")
      .send({
        name: "Dr João",
        email: "joao@test.com",
        password: "123456",
        cro: "123456-PB",
      });


    expect(response.status).toBe(201);

    expect(response.body.message)
      .toBe("Dentista cadastrado com sucesso!");


    const dentist = await prisma.dentist.findUnique({
      where:{
        email:"joao@test.com"
      }
    });


    expect(dentist).not.toBeNull();
    expect(dentist?.cro).toBe("123456-PB");

  });



  it("POST /auth/login should login an existing dentist", async () => {


    await request(app)
      .post("/auth/signup/dentist")
      .send({
        name:"Dr João",
        email:"joao@test.com",
        password:"123456",
        cro:"123456-PB",
      });



    const response = await request(app)
  .post("/auth/login")
  .send({
    email:"joao@test.com",
    password:"123456",
    role:"dentist"
  });

console.log(response.body);

expect(response.status).toBe(200);


    expect(response.status).toBe(200);

    expect(response.body.token)
      .toBeDefined();


    expect(response.body.role)
      .toBe("dentist");

  });

});