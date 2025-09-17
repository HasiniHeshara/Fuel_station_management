const mongoose = require("mongoose");
const bulkpaymentSchema = new mongoose.Schema({

  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "BulkOrder", required: true },

  fuelType: String,

  quantity: Number,

  pricePerLiter: Number,

  totalAmount: Number,

  cardNumber: String, 

  expiryDate: String,

  cvv: String,

}, { timestamps: true });

module.exports = mongoose.model(
  "Bulkincome", 
  bulkpaymentSchema
);
