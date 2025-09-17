const Payment = require("../Models/Bulkincome");
const BulkOrder = require("../Models/BulkOrder");

// Create a new payment
const createPayment = async (req, res) => {
  try {
    const { orderId, fuelType, quantity, pricePerLiter, totalAmount, cardNumber, expiryDate, cvv } = req.body;

    if (!orderId || !fuelType || !quantity || !pricePerLiter || !totalAmount) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    const payment = new Payment({
      orderId,
      fuelType,
      quantity,
      pricePerLiter,
      totalAmount,
      cardNumber,
      expiryDate,
      cvv
    });

    await payment.save();

    // Update bulk order status to 'paid'
    await BulkOrder.findByIdAndUpdate(orderId, { status: "paid" });

    res.json({ status: "ok", message: "Payment successful", data: payment });
  } catch (err) {
    console.error("Payment creation error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("orderId");
    res.json({ status: "ok", data: payments });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId).populate("orderId");
    if (!payment) return res.status(404).json({ status: "error", message: "Payment not found" });
    res.json({ status: "ok", data: payment });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Delete payment
const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const deleted = await Payment.findByIdAndDelete(paymentId);
    if (!deleted) return res.status(404).json({ status: "error", message: "Payment not found" });
    res.json({ status: "ok", message: "Payment deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};


exports.createPayment = createPayment;
exports.getAllPayments = getAllPayments;
exports.getPaymentById = getPaymentById;
exports.deletePayment = deletePayment;