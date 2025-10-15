const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema(
  {
    // Contact person name
    name: { type: String, required: true, trim: true },

    // Company / Business name (optional but useful)
    company: { type: String, trim: true, default: "" },

    // Email (unique)
    gmail: {
      type: String,
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Phone number
    contact: { type: String, required: true, trim: true },

    // Address
    address: { type: String, required: true, trim: true },

    // Optional category or material they supply (e.g., Diesel, Petrol, Spares)
    category: { type: String, trim: true, default: "" },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", SupplierSchema);
