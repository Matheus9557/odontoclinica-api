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



describe("Pain Scale Integration Tests", () => {



  async function createPatient() {

    const dentistToken =
      await createDentistAndLogin();


    await request(app)
      .post("/patients")
      .set(
        "Authorization",
        `Bearer ${dentistToken}`
      )
      .send({
        name: "Maria",
        email: "maria@test.com",
        password: "123456",
      });



    const login =
      await request(app)
        .post("/auth/login")
        .send({
          email: "maria@test.com",
          password: "123456",
          role: "patient",
        });



    return {
      dentistToken,
      patientToken: login.body.token,
    };

  }



  async function createEvaluation() {

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



    const evaluation =
      await prisma.evaluation.create({
        data:{
          patientId: patient!.id,
          startDate: new Date(),
          endDate: new Date(
            Date.now() +
            30 * 24 * 60 * 60 * 1000
          ),
        }
      });


    return {
      dentist,
      patient,
      evaluation,
    };

  }




  it("POST /pain-scale should create daily pain entry", async()=>{


    const {
      patientToken
    } = await createPatient();



    const {
      evaluation
    } = await createEvaluation();



    const response =
      await request(app)
        .post("/pain-scale")
        .set(
          "Authorization",
          `Bearer ${patientToken}`
        )
        .field(
          "scale",
          "8"
        )
        .field(
          "comments",
          "Dor ao mastigar"
        )
        .field(
          "evaluationId",
          evaluation.id
        )
        .attach(
          "image",
          Buffer.from(
            "fake image"
          ),
          "boca.png"
        );



    expect(response.status)
      .toBe(201);



    expect(response.body.scale)
      .toBe(8);



    expect(response.body.evaluationId)
      .toBe(evaluation.id);



    const entry =
      await prisma.painScaleEntry.findUnique({
        where:{
          id:response.body.id
        }
      });



    expect(entry)
      .not
      .toBeNull();


  });





  it("POST /pain-scale should reject without evaluation", async()=>{


    const {
      patientToken
    } = await createPatient();



    const response =
      await request(app)
        .post("/pain-scale")
        .set(
          "Authorization",
          `Bearer ${patientToken}`
        )
        .field(
          "scale",
          "5"
        )
        .field(
          "comments",
          "Dor moderada"
        )
        .attach(
          "image",
          Buffer.from(
            "fake image"
          ),
          "boca.png"
        );



    expect(response.status)
      .toBe(400);



  });





  it("GET /pain-scale/patient/:patientId should return patient history", async()=>{


    const {
      patientToken,
      dentistToken
    } =
      await createPatient();



    const {
      patient,
      evaluation
    } =
      await createEvaluation();




    await request(app)
      .post("/pain-scale")
      .set(
        "Authorization",
        `Bearer ${patientToken}`
      )
      .field(
        "scale",
        "6"
      )
      .field(
        "comments",
        "Primeiro registro"
      )
      .field(
        "evaluationId",
        evaluation.id
      )
      .attach(
        "image",
        Buffer.from(
          "fake image"
        ),
        "imagem.png"
      );




    const response =
      await request(app)
        .get(
          `/pain-scale/patient/${patient!.id}`
        )
        .set(
          "Authorization",
          `Bearer ${dentistToken}`
        );



    expect(response.status)
      .toBe(200);



    expect(response.body)
      .toHaveLength(1);



    expect(response.body[0].scale)
      .toBe(6);


  });

it("GET /pain-scale/patient/:patientId should not allow another dentist access", async()=>{


  const {
    patientToken
  } = await createPatient();



  const {
    patient
  } = await createEvaluation();



  const dentistB =
    await request(app)
      .post("/auth/signup/dentist")
      .send({
        name:"Dr Pedro",
        email:"pedro@test.com",
        password:"123456",
        cro:"654321-PB",
      });



  const loginDentistB =
    await request(app)
      .post("/auth/login")
      .send({
        email:"pedro@test.com",
        password:"123456",
        role:"dentist",
      });



  const response =
    await request(app)
      .get(
        `/pain-scale/patient/${patient!.id}`
      )
      .set(
        "Authorization",
        `Bearer ${loginDentistB.body.token}`
      );



  expect(response.status)
    .toBe(403);


});


});