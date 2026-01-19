"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.onlyDentist = onlyDentist;
exports.onlyPatient = onlyPatient;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'segredo123';
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: 'Token ausente' });
    const [, token] = authHeader.split(' ');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Token inválido' });
    }
}
function onlyDentist(req, res, next) {
    if (req.user?.role !== 'dentist') {
        return res.status(403).json({ error: 'Acesso permitido apenas para dentistas' });
    }
    next();
}
function onlyPatient(req, res, next) {
    if (req.user?.role !== 'patient') {
        return res.status(403).json({ error: 'Acesso permitido apenas para pacientes' });
    }
    next();
}
