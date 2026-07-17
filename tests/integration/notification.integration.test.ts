import request from "supertest";

import app from "../../src/app";

import {
  prisma,
} from "../../src/lib/prisma";


import {
  cleanDatabase,
} from "../helpers/database";



beforeEach(async()=>{

  await cleanDatabase();

});



afterAll(async()=>{

  await prisma.$disconnect();

});





async function createDentistAndLogin(){


  await request(app)
    .post("/auth/signup/dentist")
    .send({

      name:"Dr João",

      email:"joao@test.com",

      password:"123456",

      cro:"123456-PB",

    });



  const login =
    await request(app)
      .post("/auth/login")
      .send({

        email:"joao@test.com",

        password:"123456",

        role:"dentist",

      });



  return login.body.token;

}






describe(
  "Notification Integration Tests",
  ()=>{





it(
"GET /notifications/unread-count should return zero",
async()=>{


 const token =
   await createDentistAndLogin();



 const response =
   await request(app)

   .get(
    "/notifications/unread-count"
   )

   .set(
    "Authorization",
    `Bearer ${token}`
   );



 expect(response.status)
   .toBe(200);



 expect(response.body.unread)
   .toBe(0);



});







it(
"should count notifications created by messages",
async()=>{


 const token =
   await createDentistAndLogin();



 const dentist =
   await prisma.dentist.findUnique({

    where:{
      email:"joao@test.com"
    }

   });



 const patient =
   await prisma.patient.create({

    data:{

      name:"Paciente Teste",

      email:"paciente@test.com",

      password:"123456",

      dentistId: dentist!.id,

    }

   });




 await prisma.notification.create({

   data:{

    userId: dentist!.id,

    type:"MESSAGE",

   }

 });





 const response =
   await request(app)

   .get(
    "/notifications/unread-count"
   )

   .set(
    "Authorization",
    `Bearer ${token}`
   );





 expect(response.body.unread)
   .toBe(1);



});









it(
"PATCH /notifications/read-all should mark notifications as read",
async()=>{


 const token =
   await createDentistAndLogin();



 const dentist =
   await prisma.dentist.findUnique({

    where:{
      email:"joao@test.com"
    }

   });



 await prisma.notification.create({

  data:{

    userId: dentist!.id,

    type:"MESSAGE",

  }

 });





 const response =
   await request(app)

   .patch(
    "/notifications/read-all"
   )

   .set(
    "Authorization",
    `Bearer ${token}`
   );



 expect(response.status)
   .toBe(204);





 const notification =
   await prisma.notification.findFirst({

    where:{
      userId: dentist!.id
    }

   });





 expect(notification?.read)
   .toBe(true);



});





});