import { PainScaleRepository } from "../repositories/painScaleRepository";


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

      throw new Error(
        "Escala deve ser um número inteiro entre 1 e 10."
      );

    }




    const patient =
      await this.repository.findPatient(
        patientId
      );



    if (!patient) {

      throw new Error(
        "Paciente não encontrado."
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

      throw new Error(
        "Avaliação não encontrada para este paciente."
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

      throw new Error(
        "A avaliação não está ativa."
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

      throw new Error(
        "Paciente já enviou o relato diário."
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

      throw new Error(
        "Paciente não encontrado."
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

      throw new Error(
        "Acesso negado."
      );

    }




    return this.repository.findHistory(

      patientId

    );


  }



}