import request from "supertest";

import app from "../../src/app";
import { prisma } from "../../src/lib/prisma";

import { cleanDatabase } from "../helpers/database";
import { createDentistAndLogin } from "../helpers/auth";
import { createPatient } from "../helpers/patient";


beforeEach(async () => {
  await cleanDatabase();
});


afterAll(async () => {
  await prisma.$disconnect();
});


describe("Patient Integration Tests", () => {


  it("POST /patients should create a patient linked to the logged dentist", async () => {

    const token = await createDentistAndLogin();


    const response = await createPatient(token);


    expect(response.status)
      .toBe(201);


    expect(response.body.name)
      .toBe("Maria");


    const dentist =
      await prisma.dentist.findUnique({
        where:{
          email:"joao@test.com"
        }
      });


    const patient =
      await prisma.patient.findUnique({
        where:{
          email:"maria@test.com"
        }
      });


    expect(patient)
      .not
      .toBeNull();


    expect(patient?.dentistId)
      .toBe(dentist?.id);

  });



  it("GET /patients should return only patients from logged dentist", async()=>{

    const token =
      await createDentistAndLogin();


    await createPatient(token);


    const response =
      await request(app)
      .get("/patients")
      .set(
        "Authorization",
        `Bearer ${token}`
      );


    expect(response.status)
      .toBe(200);


    expect(response.body)
      .toHaveLength(1);


    expect(response.body[0].email)
      .toBe("maria@test.com");

  });



  it("GET /patients/me should return logged patient", async()=>{

    const dentistToken =
      await createDentistAndLogin();


    await createPatient(dentistToken);


    const login =
      await request(app)
      .post("/auth/login")
      .send({
        email:"maria@test.com",
        password:"123456",
        role:"patient"
      });


    expect(login.status)
      .toBe(200);


    expect(login.body.token)
      .toBeDefined();


    const response =
      await request(app)
      .get("/patients/me")
      .set(
        "Authorization",
        `Bearer ${login.body.token}`
      );


    expect(response.status)
      .toBe(200);


    expect(response.body.email)
      .toBe("maria@test.com");

  });



  it("PUT /patients/:id should update patient", async()=>{

    const token =
      await createDentistAndLogin();


    await createPatient(token);


    const patient =
      await prisma.patient.findUnique({
        where:{
          email:"maria@test.com"
        }
      });


    expect(patient)
      .not
      .toBeNull();


    const response =
      await request(app)
      .put(`/patients/${patient!.id}`)
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        name:"Maria Atualizada"
      });


    expect(response.status)
      .toBe(200);


    expect(response.body.name)
      .toBe("Maria Atualizada");

  });



  it("DELETE /patients/:id should delete patient", async()=>{

    const token =
      await createDentistAndLogin();


    await createPatient(token);


    const patient =
      await prisma.patient.findUnique({
        where:{
          email:"maria@test.com"
        }
      });


    expect(patient)
      .not
      .toBeNull();


    const response =
      await request(app)
      .delete(`/patients/${patient!.id}`)
      .set(
        "Authorization",
        `Bearer ${token}`
      );


    expect(response.status)
      .toBe(200);


    const deleted =
      await prisma.patient.findUnique({
        where:{
          id:patient!.id
        }
      });


    expect(deleted)
      .toBeNull();

  });



  it("GET /patients should not return patients from another dentist", async()=>{

    const dentistA =
      await createDentistAndLogin();


    await createPatient(dentistA);



    await request(app)
    .post("/auth/signup/dentist")
    .send({
      name:"Dr Pedro",
      email:"pedro@test.com",
      password:"123456",
      cro:"654321-PB"
    });



    const dentistB =
      await request(app)
      .post("/auth/login")
      .send({
        email:"pedro@test.com",
        password:"123456",
        role:"dentist"
      });



    const response =
      await request(app)
      .get("/patients")
      .set(
        "Authorization",
        `Bearer ${dentistB.body.token}`
      );


    expect(response.status)
      .toBe(200);


    expect(response.body)
      .toHaveLength(0);

  });



  it("POST /patients should reject patient user", async()=>{

    const dentistToken =
      await createDentistAndLogin();


    await createPatient(dentistToken);



    const login =
      await request(app)
      .post("/auth/login")
      .send({
        email:"maria@test.com",
        password:"123456",
        role:"patient"
      });



    const response =
      await request(app)
      .post("/patients")
      .set(
        "Authorization",
        `Bearer ${login.body.token}`
      )
      .send({
        name:"Outro Paciente",
        email:"outro@test.com",
        password:"123456"
      });



    expect(response.status)
      .toBe(403);

  });


});