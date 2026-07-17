export class UploadService {
  generatePublicUrl(filename: string) {

    const baseUrl =
      process.env.API_URL ||
      `http://localhost:${process.env.PORT || 3000}`;

    return `${baseUrl}/uploads/${filename}`;
  }
}