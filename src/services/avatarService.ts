import { UploadService } from "./uploadService";
import { AvatarRepository } from "../repositories/avatarRepository";

export class AvatarService {

    constructor(
        private readonly uploadService: UploadService,
        private readonly repository: AvatarRepository
    ) {}

    async updateAvatar(
        user: {
            id: string;
            role: "dentist" | "patient";
        },
        file: Express.Multer.File
    ) {

        const avatarUrl =
            await this.uploadService.uploadImage(
                file,
                "oralsync/avatars"
            );

        if (user.role === "dentist") {

            await this.repository.updateDentistAvatar(
                user.id,
                avatarUrl
            );

        } else {

            await this.repository.updatePatientAvatar(
                user.id,
                avatarUrl
            );

        }

        return avatarUrl;

    }

}