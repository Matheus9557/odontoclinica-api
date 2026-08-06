import { IStorageProvider } from "./IStorageProvider";

export class FakeStorage
  implements IStorageProvider
{
  async upload(): Promise<string> {

    return "https://fake-storage.test/image.png";

  }
}