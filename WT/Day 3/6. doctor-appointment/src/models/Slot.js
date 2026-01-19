import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    startAt: { type: Date, required: true, index: true },
    endAt: { type: Date, required: true },
    status: { type: String, enum: ['AVAILABLE', 'BOOKED'], default: 'AVAILABLE', index: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null }
  },
  { timestamps: true }
);

slotSchema.index({ doctorId: 1, startAt: 1 }, { unique: true });

export const Slot = mongoose.model('Slot', slotSchema);
