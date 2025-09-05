/// <reference path="./@types/express/index.d.ts" />

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth';
import dentistRoutes from './routes/dentist';
import patientRoutes from './routes/patient';
import evaluationRoutes from './routes/evaluation';
import imagesRoutes from './routes/images';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI não definida no .env");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch((err) => console.error('❌ Erro ao conectar MongoDB:', err));

// Rotas
app.use('/auth', authRoutes);
app.use('/dentists', dentistRoutes);
app.use('/patients', patientRoutes);
app.use('/evaluations', evaluationRoutes);
app.use('/images', imagesRoutes);
app.use('/upload', uploadRoutes);

// Rota de teste
app.get('/', (req, res) => res.send('🚀 API Odontoclínica funcionando!'));

// Inicializar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
