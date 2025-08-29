import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  patientId: String,
  evaluationId: String,
  filename: String,
  path: String,
  uploadedAt: { type: Date, default: Date.now },
});

const ImageModel = mongoose.model('Image', ImageSchema);

export default ImageModel;
