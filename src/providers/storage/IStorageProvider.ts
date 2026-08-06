export interface IStorageProvider {
  upload(
    file: Express.Multer.File,
    folder: string
  ): Promise<string>;
}