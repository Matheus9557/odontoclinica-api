import "express-serve-static-core";
import { UserRole } from "../types/auth";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: UserRole;
    };

    file?: Express.Multer.File;
  }
}