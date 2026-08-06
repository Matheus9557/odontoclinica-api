import { IStorageProvider } from "../providers/storage/IStorageProvider";
import { CloudinaryStorage } from "../providers/storage/CloudinaryStorage";

export class UploadService {

  constructor(

    private readonly storage: IStorageProvider =
      new CloudinaryStorage()

  ) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string
  ) {

    return this.storage.upload(
      file,
      folder
    );

  }

}