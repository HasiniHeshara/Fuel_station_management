import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./BulkPaymentList.css";
import logo from "../../assets/f2.png";

function BulkPaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments");
      if (res.data.status === "ok") {
        setPayments(res.data.data);
      } else {
        alert("Failed to load payments");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (paymentId) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/payments/${paymentId}`);
      if (res.data.status === "ok") {
        alert("Payment deleted successfully");
        setPayments(payments.filter((p) => p._id !== paymentId));
      } else {
        alert(res.data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting payment");
    }
  };

  const downloadPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Bulk Payment Records", 14, 20);

    const tableColumn = ["Order ID", "Fuel Type", "Quantity (L)", "Price/L", "Total (Rs)", "Date"];
    const tableRows = [];

    filteredPayments.forEach((p) => {
      tableRows.push([
        p.orderId?._id || "N/A",
        p.fuelType,
        p.quantity,
        p.pricePerLiter,
        p.totalAmount,
        new Date(p.createdAt).toLocaleDateString(),
      ]);
    });

    const totalAmount = filteredPayments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
    tableRows.push(["", "", "", "", `Total: ${totalAmount.toFixed(2)}`, ""]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("Bulk_Payment_Records.pdf");
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return;

  const filteredPayments = searchDate
    ? payments.filter(
        (p) => new Date(p.createdAt).toLocaleDateString() === new Date(searchDate).toLocaleDateString()
      )
    : payments;

  return (
    <div className="payments-list-container">
      {/* Navbar */}
      <nav className="payments-navbar">
        <Link to="/" className="nav-title">Dasu Filling Station, Galle</Link>
        <div className="nav-links">
          <Link to="/admin">Admin</Link>
          <Link to="/">Logout</Link>
        </div>
      </nav>

      {/* Logo */}
      <div className="payments-logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className="payments-content">
        <h2>📄 All Bulk Orders Income</h2>

        <div className="payments-controls">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <button onClick={downloadPdf}>📄 Download PDF</button>
        </div>

        {filteredPayments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          <table className="payments-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Fuel Type</th>
                <th>Quantity (L)</th>
                <th>Price/L</th>
                <th>Total (Rs)</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.orderId?._id || "N/A"}</td>
                  <td>{payment.fuelType}</td>
                  <td>{payment.quantity}</td>
                  <td>{payment.pricePerLiter}</td>
                  <td>{payment.totalAmount}</td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="payments-delete-btn"
                      onClick={() => deletePayment(payment._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BulkPaymentList;
