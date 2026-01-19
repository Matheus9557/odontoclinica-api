"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../utils/multer");
const router = (0, express_1.Router)();
router.post('/', multer_1.upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    res.json({ filename: req.file.filename, path: req.file.path });
});
exports.default = router;
