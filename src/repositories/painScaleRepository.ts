import { prisma } from "../lib/prisma";


export class PainScaleRepository {


  async findPatient(patientId: string) {

    return prisma.patient.findUnique({

      where: {
        id: patientId,
      },

      select: {
        id: true,
        dentistId: true,
      },

    });

  }



  async findEvaluation(
    evaluationId: string,
    patientId: string
  ) {

    return prisma.evaluation.findFirst({

      where: {
        id: evaluationId,
        patientId,
      },

    });

  }



  async findTodayEntry(
    patientId: string
  ) {


    const startOfDay =
      new Date();


    startOfDay.setHours(
      0,
      0,
      0,
      0
    );


    const endOfDay =
      new Date();


    endOfDay.setHours(
      23,
      59,
      59,
      999
    );


    return prisma.painScaleEntry.findFirst({

      where: {

        patientId,

        date: {

          gte: startOfDay,

          lte: endOfDay,

        },

      },

    });


  }



  async create(data: {

    scale: number;

    comments?: string;

    imageUrl: string;

    patientId: string;

    dentistId: string;

    evaluationId: string;

  }) {


    return prisma.painScaleEntry.create({

      data,

    });


  }




  async findHistory(
    patientId: string
  ) {


    return prisma.painScaleEntry.findMany({

      where: {

        patientId,

      },


      orderBy: {

        date: "asc",

      },


      include: {

        evaluation: {

          select: {

            id: true,

            startDate: true,

            endDate: true,

          },

        },

      },

    });


  }


}