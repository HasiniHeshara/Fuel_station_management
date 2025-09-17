const DailyFuelPrice = require("../Models/DailyFuelPrice");

// Add or update price (upsert)
const addOrUpdateDailyFuelPrice = async (req, res) => {
  const { date, type, pricePerLiter } = req.body;

  if (!date || !type || pricePerLiter == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const price = await DailyFuelPrice.findOneAndUpdate(
      { date, type },
      { pricePerLiter },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ message: "Price saved", price });
  } catch (error) {
    console.error("Error saving daily fuel price:", error);
    return res.status(500).json({ message: "Failed to save price" });
  }
};

// (Optional) Get all daily prices
const getAllDailyFuelPrices = async (req, res) => {
  try {
    const prices = await DailyFuelPrice.find({});
    return res.status(200).json({ prices });
  } catch (error) {
    console.error("Error fetching daily fuel prices:", error);
    return res.status(500).json({ message: "Failed to fetch prices" });
  }
};

module.exports = {
  addOrUpdateDailyFuelPrice,
  getAllDailyFuelPrices,
};
