const express = require("express");
const router = express.Router();
const Supplier = require("../Controllers/supplier");

// Create (register) supplier
router.post("/", Supplier.addSupplier);

// List all
router.get("/", Supplier.getAllSuppliers);

// Read one
router.get("/:id", Supplier.getSupplierById);

// Update
router.put("/:id", Supplier.updateSupplier);

// Delete
router.delete("/:id", Supplier.deleteSupplier);

module.exports = router;