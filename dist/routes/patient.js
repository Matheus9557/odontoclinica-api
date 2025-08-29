"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Dentista vê todos seus pacientes
router.get('/', authMiddleware_1.authenticate, authMiddleware_1.onlyDentist, async (req, res) => {
    try {
        const dentistId = req.user.id;
        const patients = await prisma.patient.findMany({
            where: { dentistId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        res.json(patients);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pacientes.' });
    }
});
exports.default = router;
