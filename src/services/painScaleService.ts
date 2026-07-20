import { PainScaleRepository } from "../repositories/painScaleRepository";
import { AppError } from "../errors/AppError";

export class PainScaleService {


  private readonly repository =
    new PainScaleRepository();




  async createDailyEntry(data: {

    patientId: string;

    scale: number;

    comments?: string;

    imageUrl: string;

    evaluationId: string;

  }) {


    const {

      patientId,

      scale,

      comments,

      imageUrl,

      evaluationId,

    } = data;




    /**
     * Regra clínica:
     * escala deve ser número inteiro
     * entre 1 e 10
     */

    if (

      !Number.isInteger(scale) ||

      scale < 1 ||

      scale > 10

    ) {

      throw new AppError(
        "Escala deve ser um número inteiro entre 1 e 10.",
          400
            );

    }




    const patient =
      await this.repository.findPatient(
        patientId
      );



    if (!patient) {

      throw new AppError(
        "Paciente não encontrado.",
          404
            );

    }





    /**
     * Garante que a avaliação pertence
     * ao paciente autenticado
     */

    const evaluation =
      await this.repository.findEvaluation(

        evaluationId,

        patientId

      );



    if (!evaluation) {

      throw new AppError(
        "Avaliação não encontrada para este paciente.",
          404
            );

    }




    /**
     * Regra clínica:
     *
     * startDate <= hoje <= endDate
     */

    const now =
      new Date();



    if (

      now < evaluation.startDate ||

      now > evaluation.endDate

    ) {

      throw new AppError(
        "A avaliação não está ativa.",
          400
            );

    }




    /**
     * Regra clínica:
     *
     * 1 paciente
     * ↓
     * 1 registro
     * ↓
     * por dia
     */


    const existingEntry =
      await this.repository.findTodayEntry(

        patientId

      );



    if (existingEntry) {

      throw new AppError(
        "Paciente já enviou o relato diário.",
          409
            );

    }





    return this.repository.create({

      scale,

      comments,

      imageUrl,

      patientId,

      dentistId:
        patient.dentistId,

      evaluationId,

    });


  }







  async getPatientHistory(data: {

    dentistId: string;

    patientId: string;

  }) {



    const {

      dentistId,

      patientId,

    } = data;





    const patient =
      await this.repository.findPatient(

        patientId

      );




    if (!patient) {

      throw new AppError(
        "Paciente não encontrado.",
          404
            );

    }




    /**
     * Segurança:
     *
     * Dentista só acessa
     * seus próprios pacientes
     */


    if (

      patient.dentistId !== dentistId

    ) {

      throw new AppError(
        "Acesso negado.",
          403
            );

    }




    return this.repository.findHistory(

      patientId

    );


  }



}