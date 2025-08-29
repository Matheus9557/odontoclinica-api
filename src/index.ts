import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import evaluationRoutes from './routes/evaluation';
import imageRoutes from './routes/images';
import patientRoutes from './routes/patient';

dotenv.config();

const app = express();
app.use(express.json());

// Conexão MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI não definida no .env");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar MongoDB:', err));

// Rotas
app.use('/auth', authRoutes);
app.use('/evaluations', evaluationRoutes);
app.use('/images', imageRoutes);
app.use('/patients', patientRoutes); // apenas uma vez

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
