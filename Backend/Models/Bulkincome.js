const mongoose = require("mongoose");
const bulkpaymentSchema = new mongoose.Schema({

  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "BulkOrder", 
    required: true 
  },

  fuelType: {
    type: String,
    required: true,
  },  

  quantity: { 
    type: Number,
    required: true
  },

  pricePerLiter: { 
    type: Number,
    required: true
  }, 

  totalAmount: { 
    type:Number,
    required: true
  },

  cardNumber: { 
    type: String,
    required: true
  }, 

  expiryDate: {
    type: String,
    required: true
  },

  cvv: {
    type: String,
    required: true
  },

}, { timestamps: true });

module.exports = mongoose.model(
  "Bulkincome", 
  bulkpaymentSchema
);
