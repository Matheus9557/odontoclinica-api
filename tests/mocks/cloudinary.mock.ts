export const uploadStreamMock = jest.fn();

jest.mock("../../src/config/cloudinary", () => ({
  cloudinary: {
    uploader: {
      upload_stream: uploadStreamMock,
    },
  },
}));

beforeEach(() => {
  uploadStreamMock.mockReset();

  uploadStreamMock.mockImplementation(
    (_options: any, callback: any) => {
      return {
        end: () => {
          callback(null, {
            secure_url:
              "https://cloudinary.test/test-image.png",
          });
        },
      };
    }
  );
});