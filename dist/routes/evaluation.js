"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Criar nova avaliação (Dentista)
router.post('/:patientId', authMiddleware_1.authenticate, async (req, res) => {
    const { patientId } = req.params;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);
    try {
        const evaluation = await prisma.evaluation.create({
            data: {
                patientId,
                startDate,
                endDate,
            },
        });
        res.json(evaluation);
    }
    catch (error) {
        res.status(400).json({ error: 'Erro ao criar avaliação' });
    }
});
// Registrar escala de dor (Paciente)
router.post('/pain/:evaluationId', authMiddleware_1.authenticate, async (req, res) => {
    const { evaluationId } = req.params;
    const { scale } = req.body;
    const date = new Date();
    try {
        const entry = await prisma.painScaleEntry.create({
            data: {
                evaluationId,
                date,
                scale: parseInt(scale),
            },
        });
        res.json(entry);
    }
    catch (error) {
        res.status(400).json({ error: 'Erro ao registrar escala de dor' });
    }
});
// Buscar todas escalas de dor de uma avaliação
router.get('/pain/:evaluationId', authMiddleware_1.authenticate, async (req, res) => {
    const { evaluationId } = req.params;
    try {
        const entries = await prisma.painScaleEntry.findMany({
            where: { evaluationId },
            orderBy: { date: 'asc' },
        });
        res.json(entries);
    }
    catch (error) {
        res.status(400).json({ error: 'Erro ao buscar dados de dor' });
    }
});
// Gerar gráfico de dor (dados para o gráfico)
router.get('/pain-chart/:evaluationId', authMiddleware_1.authenticate, async (req, res) => {
    const { evaluationId } = req.params;
    try {
        const entries = await prisma.painScaleEntry.findMany({
            where: { evaluationId },
            orderBy: { date: 'asc' },
        });
        const result = entries.map(entry => ({
            date: entry.date.toISOString().split('T')[0],
            scale: entry.scale,
        }));
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: 'Erro ao gerar gráfico' });
    }
});
router.get('/patient/:patientId', authMiddleware_1.authenticate, async (req, res) => {
    const { patientId } = req.params;
    try {
        const evaluations = await prisma.evaluation.findMany({
            where: { patientId },
            orderBy: { startDate: 'desc' },
        });
        res.json(evaluations);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar avaliações' });
    }
});
exports.default = router;
