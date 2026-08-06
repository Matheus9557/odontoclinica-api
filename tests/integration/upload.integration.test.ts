import "../mocks/cloudinary.mock";

import request from "supertest";
import app from "../../src/app";

import { createDentistAndLogin } from "../helpers/auth";
import { cleanDatabase } from "../helpers/database";
import { createTestFile } from "../helpers/file";

describe("Upload Integration", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("deve fazer upload de arquivo", async () => {
    const token = await createDentistAndLogin();

    const file = createTestFile();

    const response = await request(app)
      .post("/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", file);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      url: "https://cloudinary.test/test-image.png",
    });
  });

  it("deve atualizar avatar do dentista", async () => {
    const token = await createDentistAndLogin();

    const file = createTestFile();

    const response = await request(app)
      .post("/upload/avatar")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", file);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      avatarUrl: "https://cloudinary.test/test-image.png",
    });
  });
});