import { prisma } from "../lib/prisma";

export class AvatarRepository {

    async updateDentistAvatar(
        dentistId: string,
        avatar: string
    ) {
        return prisma.dentist.update({
            where: { id: dentistId },
            data: { avatar }
        });
    }

    async updatePatientAvatar(
        patientId: string,
        avatar: string
    ) {
        return prisma.patient.update({
            where: { id: patientId },
            data: { avatar }
        });
    }

}