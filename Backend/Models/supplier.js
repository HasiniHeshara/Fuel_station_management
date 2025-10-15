const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema(
  {
    // Contact person name
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },

    company: { 
      type: String, 
      trim: true, 
      default: "" 
    },

    gmail: {
      type: String,
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    contact: { 
      type: String, 
      required: true, 
      trim: true 
    },

    address: { 
      type: String, 
      required: true, 
      trim: true 
    },

    category: { 
      type: String, 
      trim: true, 
      default: "" 
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", SupplierSchema);
