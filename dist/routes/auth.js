"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'segredo123';
// ✅ Cadastro de Dentista
router.post('/signup/dentist', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashed = bcryptjs_1.default.hashSync(password, 10);
        const user = await prisma.dentist.create({
            data: { name, email, password: hashed },
        });
        res.status(201).json(user);
    }
    catch (err) {
        res.status(400).json({ error: 'Erro ao cadastrar dentista' });
    }
});
// ✅ Cadastro de Paciente
router.post('/signup/patient', async (req, res) => {
    const { name, email, password, dentistId } = req.body;
    try {
        const hashed = bcryptjs_1.default.hashSync(password, 10);
        const user = await prisma.patient.create({
            data: { name, email, password: hashed, dentistId },
        });
        res.status(201).json(user);
    }
    catch (err) {
        res.status(400).json({ error: 'Erro ao cadastrar paciente' });
    }
});
// ✅ Login para Dentista ou Paciente
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        if (role === 'dentist') {
            const user = await prisma.dentist.findUnique({ where: { email } });
            if (!user || !bcryptjs_1.default.compareSync(password, user.password)) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: 'dentist' }, JWT_SECRET);
            return res.json({ token });
        }
        if (role === 'patient') {
            const user = await prisma.patient.findUnique({ where: { email } });
            if (!user || !bcryptjs_1.default.compareSync(password, user.password)) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: 'patient' }, JWT_SECRET);
            return res.json({ token });
        }
        res.status(400).json({ error: 'Role inválido' });
    }
    catch (err) {
        res.status(500).json({ error: 'Erro no login' });
    }
});
exports.default = router;
