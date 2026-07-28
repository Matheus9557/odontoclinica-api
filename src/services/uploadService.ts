import { cloudinary } from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";


export class UploadService {


  async uploadImage(
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

                if(error){
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