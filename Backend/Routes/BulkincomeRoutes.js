const express = require("express");
const router = express.Router();
const PaymentController = require("../Controllers/Bulkincome");

router.post("/", PaymentController.createPayment);
router.get("/", PaymentController.getAllPayments);
router.get("/:paymentId", PaymentController.getPaymentById);
router.delete("/:paymentId", PaymentController.deletePayment);

module.exports = router;
