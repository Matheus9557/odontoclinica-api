import { UploadApiResponse } from "cloudinary";

import { cloudinary } from "../../config/cloudinary";
import { IStorageProvider } from "./IStorageProvider";

export class CloudinaryStorage
  implements IStorageProvider
{
  async upload(
    file: Express.Multer.File,
    folder: string
  ): Promise<string> {

    const result =
      await new Promise<UploadApiResponse>(
        (resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder,
              },

              (error, result) => {

                if (error) {
                  reject(error);
                  return;
                }

                resolve(result!);

              }
            );

          stream.end(file.buffer);

        }
      );

    return result.secure_url;
  }
}