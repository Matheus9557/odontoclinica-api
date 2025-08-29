import { Schema, model, Document } from 'mongoose';

interface IEvaluation extends Document {
  patientId: string;
  dentistId: string;
  notes: string;
  createdAt: Date;
}

const evaluationSchema = new Schema<IEvaluation>({
  patientId: { type: String, required: true },
  dentistId: { type: String, required: true },
  notes: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IEvaluation>('Evaluation', evaluationSchema);
