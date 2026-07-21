import rateLimit from "express-rate-limit";
import { RequestHandler } from "express";


const bypassRateLimiter: RequestHandler = (_req, _res, next) => {
  next();
};


export const globalRateLimiter =
  process.env.NODE_ENV === "test"
    ? bypassRateLimiter
    : rateLimit({
        windowMs: 15 * 60 * 1000,

        limit: 100,

        standardHeaders: "draft-7",

        legacyHeaders: false,

        message: {
          success: false,
          error: "Muitas requisições. Tente novamente mais tarde."
        }
      });


export const authRateLimiter =
  process.env.NODE_ENV === "test"
    ? bypassRateLimiter
    : rateLimit({
        windowMs: 15 * 60 * 1000,

        limit: 10,

        standardHeaders: "draft-7",

        legacyHeaders: false,

        message: {
          success: false,
          error: "Muitas tentativas de autenticação. Tente novamente mais tarde."
        }
      });