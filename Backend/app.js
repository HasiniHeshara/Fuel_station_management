
const express = require("express");
const mongoose = require("mongoose");

const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");

const Memberrouter = require("./Routes/MemberRoutes");
const Stockrouter = require("./Routes/StockRoutes");
const salesRoutes = require("./Routes/sales");
const fuelPriceRoutes = require('./Routes/fuelPriceRoutes');
const fuelpaymentRoutes = require('./Routes/FuelPaymentRoutes');
const factory = require('./Routes/Factory');
const ev = require('./Routes/EVRoutes');
const Appoinment = require('./Routes/AppoinmentRoutes');
const EVpayment = require('./Routes/EVPaymentRoutes');
const combinedRoutes = require("./Routes/EVCombinedRoutes");
const bulkOrderRoutes = require('./Routes/BulkOrderRoutes');
const paymentRoutes = require("./Routes/BulkincomeRoutes");
const chatRoutes = require("./Routes/chatRoutes");

const initSocket = require("./Controllers/socket");

const app = express();
//wAnURbdzhM1ps4dw
// Middleware
app.use(express.json());
app.use(cors());

app.use("/Members", Memberrouter);
app.use("/Stocks", Stockrouter);
app.use("/sales", salesRoutes);
app.use('/fuelprices', fuelPriceRoutes);
app.use("/fuelpayments", fuelpaymentRoutes);
app.use("/factory", factory);
app.use("/ev", ev);
app.use("/appoinment", Appoinment);
app.use("/evpayment", EVpayment);
app.use("/evcombined", combinedRoutes);
app.use('/api/bulkorders', bulkOrderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chat", chatRoutes);

app.use("/files", express.static("files"));


// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Initialize Socket.io for live chat
initSocket(io);
mongoose.connect("mongodb+srv://admin:wAnURbdzhM1ps4dw@cluster0.uzozmrm.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

server.listen(5000, () => {
  console.log("Server running on port 5000 with Socket.io enabled");
});


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

