import request from "supertest";

import app from "../../src/app";
import { prisma } from "../../src/lib/prisma";

import { cleanDatabase } from "../helpers/database";
import { createDentistAndLogin } from "../helpers/auth";


beforeEach(async () => {
  await cleanDatabase();
});


afterAll(async () => {
  await prisma.$disconnect();
});


async function createPatient(token: string) {

  const response = await request(app)
    .post("/patients")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      name: "Maria",
      email: "maria@test.com",
      password: "123456",
    });


  return response.body;
}



describe("Evaluation Integration Tests", () => {


  it("POST /evaluations/:patientId should create an evaluation for patient's dentist", async () => {


    const token =
      await createDentistAndLogin();


    const patient =
      await createPatient(token);



    const response =
      await request(app)
        .post(`/evaluations/${patient.id}`)
        .set(
          "Authorization",
          `Bearer ${token}`
        );


    expect(response.status)
      .toBe(201);



    expect(response.body.patientId)
      .toBe(patient.id);



    const start =
      new Date(response.body.startDate);


    const end =
      new Date(response.body.endDate);



    const difference =
      Math.round(
        (
          end.getTime() -
          start.getTime()
        )
        /
        (
          1000 *
          60 *
          60 *
          24
        )
      );



    expect(difference)
      .toBe(30);


  });



  it("GET /evaluations/patient/:patientId should return patient's evaluations", async () => {


    const token =
      await createDentistAndLogin();



    const patient =
      await createPatient(token);



    await request(app)
      .post(`/evaluations/${patient.id}`)
      .set(
        "Authorization",
        `Bearer ${token}`
      );



    const response =
      await request(app)
        .get(`/evaluations/patient/${patient.id}`)
        .set(
          "Authorization",
          `Bearer ${token}`
        );



    expect(response.status)
      .toBe(200);



    expect(response.body)
      .toHaveLength(1);



    expect(response.body[0].patientId)
      .toBe(patient.id);


  });



  it("should not allow a dentist to create evaluation for another dentist patient", async () => {


    const dentistAToken =
      await createDentistAndLogin();



    const patient =
      await createPatient(dentistAToken);



    await request(app)
      .post("/auth/signup/dentist")
      .send({
        name: "Dr Pedro",
        email: "pedro@test.com",
        password: "123456",
        cro: "654321-PB",
      });



    const dentistBLogin =
      await request(app)
        .post("/auth/login")
        .send({
          email: "pedro@test.com",
          password: "123456",
          role: "dentist",
        });



    const response =
      await request(app)
        .post(`/evaluations/${patient.id}`)
        .set(
          "Authorization",
          `Bearer ${dentistBLogin.body.token}`
        );



    expect(response.status)
      .toBe(403);



    expect(response.body.error)
      .toBe(
        "Paciente não pertence a este dentista."
      );


  });



});