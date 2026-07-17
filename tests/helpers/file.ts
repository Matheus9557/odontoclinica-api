import fs from "fs";
import path from "path";


export function createTestFile() {

  const filePath =
    path.join(
      __dirname,
      "avatar-test.png"
    );


  fs.writeFileSync(
    filePath,
    "fake image content"
  );


  return filePath;

}