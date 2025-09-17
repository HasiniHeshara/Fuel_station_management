const express = require("express");
const router = express.Router();
const dailyPriceController = require("../Controllers/DailyPriceController");

router.post("/dailyfuelprices", dailyPriceController.addOrUpdateDailyFuelPrice);
router.get("/dailyfuelprices", dailyPriceController.getAllDailyFuelPrices); 

module.exports = router;
