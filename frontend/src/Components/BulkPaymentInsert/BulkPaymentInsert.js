import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./BulkPaymentInsert.css";
import logo from "../../assets/f2.png";
import visaImg from "../../assets/visa.webp";
import masterImg from "../../assets/master.png";
import amexImg from "../../assets/ame.png";

const fixedPrices = {
  "Petrol 92": 305,
  "Petrol 95": 341,
  "Auto Diesel": 289,
  Diesel: 325,
  Kerosine: 185,
};

function BulkPaymentInsert() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [fuelType, setFuelType] = useState(location.state?.fuelType || "");
  const [quantity, setQuantity] = useState(location.state?.quantity || 0);
  const [pricePerLiter, setPricePerLiter] = useState(0);
  const [total, setTotal] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(!fuelType || !quantity);
  const [payhereLoaded, setPayhereLoaded] = useState(false);

  // Load PayHere SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    script.onload = () => setPayhereLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bulkorders/${orderId}`);
        if (res.data.status === "ok") {
          const order = res.data.data;
          setFuelType(order.fuelType);
          setQuantity(order.quantity);
        } else {
          alert("Order details not found");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    if (!fuelType || !quantity) fetchOrder();
    else setLoading(false);
  }, [orderId, fuelType, quantity]);

  // Calculate price per liter and total
  useEffect(() => {
    if (!fuelType || !quantity) return;
    const normalizedFuelType = fuelType.trim();
    const price = fixedPrices[normalizedFuelType] || 0;
    setPricePerLiter(price);
    setTotal(quantity * price);
  }, [fuelType, quantity]);

  // Validation helpers
  const isValidCardNumber = (num) => /^\d{16}$/.test(num);

  const isValidExpiryDate = (date) => {
    if (!/^\d{2}\/\d{2}$/.test(date)) return false;
    const [mm, yy] = date.split("/").map(Number);
    if (mm < 1 || mm > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (yy < currentYear) return false;
    if (yy === currentYear && mm < currentMonth) return false;

    return true;
  };

  const isValidCvv = (num) => /^\d{3}$/.test(num);

  // Handle expiry input with immediate alert for invalid entries
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, ""); // remove non-digits
    if (val.length > 4) val = val.slice(0, 4);   // limit to 4 digits MMYY
    if (val.length >= 3) {
      let month = parseInt(val.slice(0, 2), 10);
      if (month < 1 || month > 12) {
        alert("Enter a valid month (01-12)");
        val = "";
      }
      val = month.toString().padStart(2, "0") + "/" + val.slice(2);
    }
    setExpiryDate(val);
  };

  // Manual card payment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidCardNumber(cardNumber)) return alert("Card number must be exactly 16 digits.");
    if (!isValidExpiryDate(expiryDate)) return alert("Enter a valid expiry date (MM/YY) that is not in the past.");
    if (!isValidCvv(cvv)) return alert("CVV must be exactly 3 digits.");

    try {
      const paymentData = {
        orderId,
        fuelType,
        quantity,
        pricePerLiter,
        totalAmount: total,
        cardNumber,
        expiryDate,
        cvv,
      };

      const res = await axios.post(`http://localhost:5000/api/payments`, paymentData);
      if (res.data.status === "ok") {
        alert("Payment successful!");
        navigate("/mainhome");
      } else {
        alert(res.data.message || "Payment failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing payment");
    }
  };

  // PayHere payment
  const handlePayHerePayment = async () => {
    if (!payhereLoaded) return alert("PayHere SDK not loaded yet.");
    if (!fuelType || !quantity) return alert("Order details missing.");

    const amount = total;
    const orderIdentifier = `Bulk-${Date.now()}`;

    try {
      const hashRes = await axios.post("http://localhost:5000/getPayhereHash", {
        order_id: orderIdentifier,
        amount,
        currency: "LKR",
      });

      const payment = {
        sandbox: true,
        merchant_id: "1231683",
        return_url: window.location.href,
        cancel_url: window.location.href,
        notify_url: "http://localhost:5000/api/payments/notify",
        order_id: orderIdentifier,
        items: `${fuelType} ${quantity}L`,
        amount,
        currency: "LKR",
        hash: hashRes.data.hash,
        first_name: "Customer",
        last_name: "",
        email: "customer@example.com",
        phone: "0771234567",
        address: "Galle",
        city: "Galle",
        country: "Sri Lanka",
      };

      window.payhere.onCompleted = async function(orderId) {
        alert("Payment completed. Order ID: " + orderId);

        try {
          await axios.post("http://localhost:5000/api/payments", {
            orderId: orderIdentifier,
            fuelType,
            quantity,
            pricePerLiter,
            totalAmount: amount,
            paymentMethod: "PayHere",
          });
          alert("Order and payment recorded successfully!");
          navigate("/mainhome");
        } catch (err) {
          console.error("Error recording order/payment:", err);
          alert("Error saving order. Please contact support.");
        }
      };

      window.payhere.onDismissed = function() { alert("Payment popup closed."); };
      window.payhere.onError = function(error) { alert("Payment error: " + error); };

      window.payhere.startPayment(payment);
    } catch (err) {
      console.error("Error starting PayHere payment:", err);
      alert("Failed to start PayHere payment.");
    }
  };

  if (loading) return <p>Loading order details...</p>;

  return (
    <div className="bulk-payment-container">
      <div className="bulk-payment-overlay">
        <img src={logo} alt="App Logo" className="bulk-payment-logo" />
        <div className="bulk-payment-card">
          <h2>💳 Payment for Bulk Order</h2>
          <p><strong>Fuel Type:</strong> {fuelType}</p>
          <p><strong>Quantity:</strong> {quantity} Liters</p>
          <p><strong>Price per Liter:</strong> Rs {pricePerLiter}</p>
          <p><strong>Total:</strong> Rs {total}</p>

          <div className="bulk-card-brands">
            <img src={visaImg} alt="Visa" />
            <img src={masterImg} alt="MasterCard" />
            <img src={amexImg} alt="American Express" />
          </div>

          {/* Manual Card Payment Form */}
          <form onSubmit={handleSubmit} className="payment-form">
            <label>Card Number:</label>
            <input
              type="text"
              maxLength="16"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="1234 5678 1234 5678"
              required
            />

            <label>Expiry Date (MM/YY):</label>
            <input
              type="text"
              maxLength="5"
              value={expiryDate}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              required
            />

            <label>CVV:</label>
            <input
              type="password"
              maxLength="3"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              placeholder="123"
              required
            />

            <button type="submit">Pay Now</button>
          </form>

          {/* PayHere Payment Button */}
          <button
            type="button"
            onClick={handlePayHerePayment}
            style={{
              marginTop: "20px",
              backgroundColor: "#0d6efd",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Pay with PayHere Rs. {total}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BulkPaymentInsert;
