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



describe("Message Integration Tests", () => {



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



    const patientLogin =
      await request(app)
        .post("/auth/login")
        .send({
          email: "maria@test.com",
          password: "123456",
          role: "patient",
        });



    const patient =
      await prisma.patient.findUnique({
        where: {
          email: "maria@test.com",
        },
      });



    return {
      dentistToken,
      patientToken: patientLogin.body.token,
      patient,
    };

  }





  it("POST /messages/send should allow dentist send message to patient", async()=>{


    const {
      dentistToken,
      patient,
    } = await createPatient();



    const response =
      await request(app)
        .post("/messages/send")
        .set(
          "Authorization",
          `Bearer ${dentistToken}`
        )
        .send({
          content:
            "Olá Maria, como está sua recuperação?",
          receiverId:
            patient!.id,
        });



    expect(response.status)
      .toBe(201);



    expect(response.body.content)
      .toBe(
        "Olá Maria, como está sua recuperação?"
      );



    const message =
      await prisma.message.findUnique({
        where:{
          id: response.body.id,
        },
      });



    expect(message)
      .not
      .toBeNull();



    expect(message?.senderType)
      .toBe("DENTIST");



    const notification =
      await prisma.notification.findFirst({
        where:{
          userId: patient!.id,
        },
      });



    expect(notification)
      .not
      .toBeNull();


  });







  it("POST /messages/send should allow patient send message to dentist", async()=>{


    const {
      patientToken,
      patient,
    } = await createPatient();



    const response =
      await request(app)
        .post("/messages/send")
        .set(
          "Authorization",
          `Bearer ${patientToken}`
        )
        .send({
          content:
            "Olá doutor, estou sentindo sensibilidade.",
          receiverId:
            patient!.dentistId,
        });



    expect(response.status)
      .toBe(201);



    expect(response.body.content)
      .toBe(
        "Olá doutor, estou sentindo sensibilidade."
      );



    expect(response.body.senderType)
      .toBe("PATIENT");



    const notification =
      await prisma.notification.findFirst({
        where:{
          userId: patient!.dentistId,
        },
      });



    expect(notification)
      .not
      .toBeNull();


  });







  it("GET /messages should return conversation history", async()=>{


    const {
      dentistToken,
      patient,
    } = await createPatient();



    await request(app)
      .post("/messages/send")
      .set(
        "Authorization",
        `Bearer ${dentistToken}`
      )
      .send({
        content:
          "Primeira mensagem",
        receiverId:
          patient!.id,
      });



    const response =
      await request(app)
        .get(
          `/messages?patientId=${patient!.id}`
        )
        .set(
          "Authorization",
          `Bearer ${dentistToken}`
        );



    expect(response.status)
      .toBe(200);



    expect(response.body)
      .toHaveLength(1);



    expect(response.body[0].content)
      .toBe(
        "Primeira mensagem"
      );


  });








  it("should not allow dentist access another dentist patient messages", async()=>{


    const {
      patient,
    } = await createPatient();



    const dentistB =
      await request(app)
        .post("/auth/signup/dentist")
        .send({
          name:"Dr Pedro",
          email:"pedro@test.com",
          password:"123456",
          cro:"654321-PB",
        });



    const dentistBLogin =
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
          `/messages?patientId=${patient!.id}`
        )
        .set(
          "Authorization",
          `Bearer ${dentistBLogin.body.token}`
        );



    expect(response.status)
      .toBe(403);


  });





});