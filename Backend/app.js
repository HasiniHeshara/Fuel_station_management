const express = require("express");
const mongoose = require("mongoose");


const Memberrouter = require("./Routes/MemberRoutes");
const ev = require('./Routes/EVRoutes');
const fuelPriceRoutes = require('./Routes/fuelPriceRoutes');
const fuelpaymentRoutes = require('./Routes/FuelPaymentRoutes');
const EVpayment = require('./Routes/EVPaymentRoutes');
const combinedRoutes = require("./Routes/EVCombinedRoutes");
const paymentRoutes = require("./Routes/BulkincomeRoutes");


const app = express();


// Middleware
app.use(express.json());

//app.use(cors());

app.use("/Members", Memberrouter);
app.use("/ev", ev);
app.use('/fuelprices', fuelPriceRoutes);
app.use("/fuelpayments", fuelpaymentRoutes);
app.use("/evpayment", EVpayment);
app.use("/api/payments", paymentRoutes);


mongoose.connect("mongodb+srv://<>:<>@cluster0.ndjygyf.mongodb.net/fuelstation", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));
