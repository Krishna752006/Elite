import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    fee: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export const Doctor = mongoose.model('Doctor', doctorSchema);
