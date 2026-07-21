import rateLimit from "express-rate-limit";


export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos

  limit: 100,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  message: {
    success: false,
    error: "Muitas requisições. Tente novamente mais tarde."
  }
});


export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  message: {
    success: false,
    error: "Muitas tentativas de autenticação. Tente novamente mais tarde."
  }
});