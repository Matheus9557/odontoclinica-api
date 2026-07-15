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


async function createDentistAndLogin() {

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
      email:"joao@test.com",
      password:"123456",
      role:"dentist"
    });


  return login.body.token;
}



describe("Dentist Integration Tests", () => {


  it("GET /dentists/me should return dentist profile", async()=>{

    const token = await createDentistAndLogin();


    const response = await request(app)
      .get("/dentists/me")
      .set(
        "Authorization",
        `Bearer ${token}`
      );


    expect(response.status)
      .toBe(200);


    expect(response.body.email)
      .toBe("joao@test.com");


  });



  it("PUT /dentists/:id should update dentist", async()=>{


    const token = await createDentistAndLogin();


    const dentist =
      await prisma.dentist.findUnique({
        where:{
          email:"joao@test.com"
        }
      });


    const response =
      await request(app)
      .put(`/dentists/${dentist!.id}`)
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        name:"Dr João Atualizado"
      });



    expect(response.status)
      .toBe(200);


    expect(response.body.name)
      .toBe("Dr João Atualizado");

  });



  it("DELETE /dentists/:id should delete dentist", async()=>{


    const token = await createDentistAndLogin();


    const dentist =
      await prisma.dentist.findUnique({
        where:{
          email:"joao@test.com"
        }
      });



    const response =
      await request(app)
      .delete(`/dentists/${dentist!.id}`)
      .set(
        "Authorization",
        `Bearer ${token}`
      );


    expect(response.status)
      .toBe(200);



    const exists =
      await prisma.dentist.findUnique({
        where:{
          id:dentist!.id
        }
      });


    expect(exists)
      .toBeNull();

  });


});