const mongoose = require("mongoose");
const FuelStorage = require("../Models/FuelStorage");
const DailySale = require("../Models/DailySale");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Record a new sale and update fuel stock accordingly
const recordSale = async (req, res) => {
  try {
    const { date, type, soldQuantity, staff } = req.body;

    // Basic presence checks
    if (!date || !type || soldQuantity === undefined || soldQuantity === null || !staff) {
      return res.status(400).json({ message: "Missing required fields (date, type, soldQuantity, staff)" });
    }

    // Validate number
    const qty = Number(soldQuantity);
    if (Number.isNaN(qty) || qty < 0) {
      return res.status(400).json({ message: "soldQuantity must be a non-negative number" });
    }

    // Validate staff ObjectId
    if (!isValidObjectId(staff)) {
      return res.status(400).json({ message: "Invalid staff id (must be a valid ObjectId)" });
    }

    // Find fuel type (case-insensitive exact match)
    const fuel = await FuelStorage.findOne({ type: { $regex: new RegExp(`^${type}$`, "i") } });
    if (!fuel) {
      return res.status(404).json({ message: `Fuel type not found: ${type}` });
    }

    // Create sale
    const sale = await DailySale.create({
      date,                 // keep string e.g. "2025-10-15"
      type: fuel.type,      // canonicalize to stored type
      soldQuantity: qty,
      staff,                // member _id
    });

    // Update fuel stock (never below 0)
    fuel.quantity = Math.max(fuel.quantity - qty, 0);
    await fuel.save();

    // Populate staff for response
    const populated = await sale.populate("staff", "name role gmail contact");
    return res.status(201).json({ message: "Sale recorded", sale: populated });

  } catch (err) {
    console.error("Error recording sale:", err);
    return res.status(500).json({ message: "Failed to record sale", error: err?.message });
  }
};

// Get all sales sorted by latest first
const getAllSales = async (req, res) => {
  try {
    const sales = await DailySale.find()
      .sort({ date: -1, createdAt: -1 })
      .populate("staff", "name role gmail contact");

    if (!sales || sales.length === 0) {
      return res.status(404).json({ message: "No sales found" });
    }
    return res.status(200).json({ sales });
  } catch (err) {
    console.error("Error fetching sales:", err);
    return res.status(500).json({ message: "Failed to get sales", error: err?.message });
  }
};

// Get sale by ID (for edit/update form)
const getSaleById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid sale id" });
    }
    const sale = await DailySale.findById(id).populate("staff", "name role gmail contact");
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    return res.status(200).json({ sale });
  } catch (err) {
    console.error("Error fetching sale by ID:", err);
    return res.status(500).json({ message: "Failed to get sale", error: err?.message });
  }
};

// Update a sale and adjust fuel storage accordingly
const updateSale = async (req, res) => {
  const { id } = req.params;
  const { date, type, soldQuantity, staff } = req.body;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid sale id" });
    }

    const oldSale = await DailySale.findById(id);
    if (!oldSale) {
      return res.status(404).json({ message: "Sale record not found" });
    }

    // Validate inputs if provided
    const qty = Number(soldQuantity);
    if (soldQuantity !== undefined && (Number.isNaN(qty) || qty < 0)) {
      return res.status(400).json({ message: "soldQuantity must be a non-negative number" });
    }
    if (staff && !isValidObjectId(staff)) {
      return res.status(400).json({ message: "Invalid staff id" });
    }

    // Revert stock for old sale
    const oldFuel = await FuelStorage.findOne({ type: { $regex: new RegExp(`^${oldSale.type}$`, "i") } });
    if (oldFuel) {
      oldFuel.quantity += Number(oldSale.soldQuantity);
      await oldFuel.save();
    }

    // Canonicalize new fuel type
    let canonicalType = oldSale.type;
    if (type) {
      const newFuelDoc = await FuelStorage.findOne({ type: { $regex: new RegExp(`^${type}$`, "i") } });
      if (!newFuelDoc) {
        return res.status(404).json({ message: `Fuel type not found: ${type}` });
      }
      canonicalType = newFuelDoc.type;
    }

    // Update sale
    const updatedSale = await DailySale.findByIdAndUpdate(
      id,
      {
        date: date ?? oldSale.date,
        type: canonicalType,
        soldQuantity: soldQuantity !== undefined ? qty : oldSale.soldQuantity,
        staff: staff ?? oldSale.staff,
      },
      { new: true, runValidators: true }
    ).populate("staff", "name role gmail contact");

    // Apply new deduction to the (possibly new) fuel type
    const applyFuel = await FuelStorage.findOne({ type: { $regex: new RegExp(`^${updatedSale.type}$`, "i") } });
    if (applyFuel) {
      applyFuel.quantity = Math.max(applyFuel.quantity - Number(updatedSale.soldQuantity), 0);
      await applyFuel.save();
    }

    return res.status(200).json({ message: "Sale updated", sale: updatedSale });
  } catch (err) {
    console.error(" Error updating sale:", err);
    return res.status(500).json({ message: "Failed to update sale", error: err?.message });
  }
};

// Delete a sale and revert fuel quantity
const deleteSale = async (req, res) => {
  const { id } = req.params;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid sale id" });
    }

    const sale = await DailySale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: "Sale record not found" });
    }

    const fuel = await FuelStorage.findOne({ type: { $regex: new RegExp(`^${sale.type}$`, "i") } });
    if (fuel) {
      fuel.quantity += Number(sale.soldQuantity);
      await fuel.save();
    }

    await DailySale.findByIdAndDelete(id);
    return res.status(200).json({ message: "Sale deleted successfully" });
  } catch (err) {
    console.error("Error deleting sale:", err);
    return res.status(500).json({ message: "Failed to delete sale", error: err?.message });
  }
};

module.exports = {
  recordSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
};
