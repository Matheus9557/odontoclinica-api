import { Schema, model, Document } from 'mongoose';

export interface IImage extends Document {
  patientId: string;
  evaluationId: string;
  filename: string;
  path: string;
  uploadedAt: Date;
}

const imageSchema = new Schema<IImage>({
  patientId: { type: String, required: true },
  evaluationId: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default model<IImage>('Image', imageSchema);
