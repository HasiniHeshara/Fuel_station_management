const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Memberrouter = require("./Routes/MemberRoutes");
const ev = require("./Routes/EVRoutes");
const fuelPriceRoutes = require("./Routes/fuelPriceRoutes");
const fuelpaymentRoutes = require("./Routes/FuelPaymentRoutes");
const EVpayment = require("./Routes/EVPaymentRoutes");
const bulkOrderRoutes = require('./Routes/BulkOrderRoutes');
const combinedRoutes = require("./Routes/EVCombinedRoutes");
const paymentRoutes = require("./Routes/BulkincomeRoutes");
const factory = require('./Routes/Factory');
const Stockrouter = require("./Routes/StockRoutes");
const Appoinment = require('./Routes/AppoinmentRoutes');



const app = express();

// Middleware
app.use(express.json());
app.use(cors());   

// Routes 
app.use("/evcombined", combinedRoutes);

app.use("/Members", Memberrouter);
app.use("/ev", ev);
app.use("/fuelprices", fuelPriceRoutes);
app.use("/fuelpayments", fuelpaymentRoutes);
app.use("/evpayment", EVpayment);
app.use('/api/bulkorders', bulkOrderRoutes);
app.use("/appoinment", Appoinment);

app.use("/api/payments", paymentRoutes);
app.use("/factory", factory);
app.use("/Stocks", Stockrouter);

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://admin:Z3etldNpHQo1A5A6@cluster0.ykdbywy.mongodb.net/fuelstation", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const md5 = require('md5');

const MERCHANT_ID = "1231683"; 
const MERCHANT_SECRET = "Nzg0MzE1MTUyMTg2ODM2NzM2NDQyMDQwNTA5NjE3NzU1NzI4NTE="; 

app.post('/getPayhereHash', (req, res) => {
  const { order_id, amount, currency } = req.body;
  if (!order_id || !amount || !currency) return res.status(400).send("Missing params");

  const hash = md5(
    MERCHANT_ID +
    order_id +
    parseFloat(amount).toFixed(2) +
    currency +
    md5(MERCHANT_SECRET).toUpperCase()
  ).toUpperCase();

  res.json({ hash });
});
