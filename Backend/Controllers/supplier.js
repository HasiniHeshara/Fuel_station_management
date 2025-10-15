const Supplier = require("../Models/supplier");

// Create (Register) Supplier
const addSupplier = async (req, res) => {
  try {
    const { name, company, gmail, contact, address, category} = req.body;

    if (!name || !gmail || !contact || !address || !category) {
      return res
        .status(400)
        .json({ message: "name, gmail, contact, and address are required" });
    }

    // Prevent duplicate email (case-insensitive)
    const exists = await Supplier.findOne({ gmail: gmail.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const doc = await Supplier.create({
      name,
      company,
      gmail,
      contact, 
      address,
      category,
    });

    return res.status(201).json({ supplier: doc });
  } catch (err) {
    console.error("Add supplier error:", err);
    return res.status(500).json({ message: "Unable to add supplier" });
  }
};

// List all suppliers
const getAllSuppliers = async (_req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    if (!suppliers.length) {
      return res.status(404).json({ message: "No suppliers found" });
    }
    return res.status(200).json({ suppliers });
  } catch (err) {
    console.error("Fetch suppliers error:", err);
    return res.status(500).json({ message: "Error retrieving suppliers" });
  }
};

// Get supplier by ID
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const sup = await Supplier.findById(id);
    if (!sup) return res.status(404).json({ message: "Supplier not found" });
    return res.status(200).json({ supplier: sup });
  } catch (err) {
    console.error("Get supplier by ID error:", err);
    return res.status(500).json({ message: "Error fetching supplier" });
  }
};

// Update supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, company, gmail, contact, address, category } = req.body;

    const updated = await Supplier.findByIdAndUpdate(
      id,
      { name, company, gmail, contact, address, category},
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Supplier not found" });
    return res.status(200).json({ supplier: updated });
  } catch (err) {
    // Handle duplicate email nicely
    if (err?.code === 11000 && err?.keyPattern?.gmail) {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error("Update supplier error:", err);
    return res.status(500).json({ message: "Unable to update supplier" });
  }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const sup = await Supplier.findByIdAndDelete(id);
    if (!sup) return res.status(404).json({ message: "Supplier not found" });
    return res.status(200).json({ message: "Supplier deleted", supplier: sup });
  } catch (err) {
    console.error("Delete supplier error:", err);
    return res.status(500).json({ message: "Unable to delete supplier" });
  }
};

module.exports = {
  addSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
