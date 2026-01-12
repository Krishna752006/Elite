const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  provider: String,
  paymentId: String,
  amount: Number,
  currency: String,
  chargedAt: String
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  currency: String,
  status: {
    type: String,
    enum: ["CREATED", "PAID", "PAYMENT_FAILED"],
    default: "CREATED"
  },
  payment: PaymentSchema
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);