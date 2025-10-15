const express = require("express");
const router = express.Router();
const Supplier = require("../Controllers/supplier");

router.post("/", Supplier.addSupplier);
router.get("/", Supplier.getAllSuppliers);
router.get("/:id", Supplier.getSupplierById);
router.put("/:id", Supplier.updateSupplier);
router.delete("/:id", Supplier.deleteSupplier);

module.exports = router;