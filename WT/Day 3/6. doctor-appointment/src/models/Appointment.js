import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true, index: true },
    status: {
      type: String,
      enum: ['REQUESTED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'PAYMENT_FAILED'],
      default: 'REQUESTED',
      index: true
    },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, createdAt: -1, _id: -1 });
appointmentSchema.index({ patientId: 1, createdAt: -1, _id: -1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
