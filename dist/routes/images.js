"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../utils/multer");
const mongoose_1 = __importDefault(require("mongoose"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Esquema para MongoDB
const ImageSchema = new mongoose_1.default.Schema({
    patientId: String,
    evaluationId: String,
    filename: String,
    path: String,
    uploadedAt: { type: Date, default: Date.now },
});
const ImageModel = mongoose_1.default.model('Image', ImageSchema);
// Upload de imagem de avaliação (Paciente)
router.post('/:patientId/:evaluationId', authMiddleware_1.authenticate, authMiddleware_1.onlyPatient, multer_1.upload.single('image'), async (req, res) => {
    try {
        const { patientId, evaluationId } = req.params;
        const file = req.file;
        if (!file)
            return res.status(400).json({ error: 'Arquivo não enviado.' });
        const saved = await ImageModel.create({
            patientId,
            evaluationId,
            filename: file.filename,
            path: file.path,
        });
        res.json(saved);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
    }
});
// Listar imagens de uma avaliação
router.get('/:evaluationId', authMiddleware_1.authenticate, async (req, res) => {
    try {
        const { evaluationId } = req.params;
        const images = await ImageModel.find({ evaluationId }).sort({ uploadedAt: -1 });
        res.json(images);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar imagens.' });
    }
});
router.get('/patient/:patientId', authMiddleware_1.authenticate, async (req, res) => {
    try {
        const { patientId } = req.params;
        const images = await ImageModel.find({ patientId }).sort({ uploadedAt: -1 });
        res.json(images);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar imagens do paciente.' });
    }
});
exports.default = router;
