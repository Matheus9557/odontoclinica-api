import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError";

import {
  DentistRepository,
} from "../repositories/dentistRepository";


export class DentistService {


  private readonly repository =
    new DentistRepository();




  async getProfile(
    dentistId: string
  ) {


    const dentist =
      await this.repository.findProfile(
        dentistId
      );


    if (!dentist) {

      throw new AppError(
        "Dentista não encontrado.",
          404
            );

    }


    return dentist;

  }





  async updateDentist(data: {

    dentistId: string;

    name?: string;

    email?: string;

    password?: string;

    cro?: string;

  }) {


    const {
      dentistId,
      name,
      email,
      password,
      cro,
    } = data;



    const dentist =
      await this.repository.findById(
        dentistId
      );



    if (!dentist) {

      throw new AppError(
        "Dentista não encontrado.",
          404
            );

    }



    const updateData:
      Prisma.DentistUpdateInput = {};



    if (name) {

      updateData.name = name;

    }



    if (email) {

      updateData.email = email;

    }



    if (cro) {

      updateData.cro = cro;

    }




    if (password) {

      updateData.password =
        await bcrypt.hash(
          password,
          10
        );

    }



    return this.repository.update(
      dentistId,
      updateData
    );


  }







  async deleteDentist(
    dentistId: string
  ) {


    const dentist =
      await this.repository.findById(
        dentistId
      );



    if (!dentist) {

      throw new AppError(
        "Dentista não encontrado.",
          404
            );

    }



    await this.repository.deletePatients(
      dentistId
    );



    await this.repository.delete(
      dentistId
    );



    return {

      message:
        "Dentista e pacientes associados foram excluídos.",

    };


  }


}