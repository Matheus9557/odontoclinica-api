import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";


export class DentistRepository {


  async findById(id: string) {

    return prisma.dentist.findUnique({
      where: {
        id,
      },
    });

  }



  async findProfile(id: string) {

    return prisma.dentist.findUnique({

      where: {
        id,
      },

      select: {

        id: true,

        name: true,

        email: true,

        cro: true,

        avatar: true,

        patients: {

          select: {

            id: true,

            name: true,

            email: true,

            avatar: true,

          },

        },

      },

    });

  }



  async update(
    id: string,
    data: Prisma.DentistUpdateInput
  ) {

    return prisma.dentist.update({

      where: {
        id,
      },

      data,

      select: {

        id: true,

        name: true,

        email: true,

        cro: true,

        avatar: true,

      },

    });

  }



  async deletePatients(
    dentistId: string
  ) {

    return prisma.patient.deleteMany({

      where: {
        dentistId,
      },

    });

  }



  async delete(
    id: string
  ) {

    return prisma.dentist.delete({

      where: {
        id,
      },

    });

  }


}