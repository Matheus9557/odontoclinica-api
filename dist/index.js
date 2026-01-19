"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const evaluation_1 = __importDefault(require("./routes/evaluation"));
const images_1 = __importDefault(require("./routes/images"));
const patient_1 = __importDefault(require("./routes/patient"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/patients', patient_1.default);
// MongoDB connection
mongoose_1.default.connect(process.env.MONGO_URL || '')
    .then(() => console.log('✅ Conectado ao MongoDB'))
    .catch((err) => console.error('Erro ao conectar MongoDB:', err));
// Routes
app.use('/auth', auth_1.default);
app.use('/evaluations', evaluation_1.default);
app.use('/images', images_1.default);
app.use('/patients', patient_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
