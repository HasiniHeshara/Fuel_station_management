import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./EVPaymentList.css";
import { Link } from "react-router-dom";
import logo from "../../assets/f2.png";

function EVPaymentList() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/evpayment/evpayment");
      if (response.data.status === "ok") {
        const sorted = response.data.data
          .slice()
          .sort((a, b) => a.createdAt?.localeCompare(b.createdAt) || 0);
        setPayments(sorted);
        setFilteredPayments(sorted);
      } else {
        setError("Failed to fetch payments.");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    setDeletingId(id);
    try {
      const response = await axios.delete(`http://localhost:5000/evpayment/delete/${id}`);
      if (response.data.status === "ok") {
        alert("Payment deleted successfully.");
        fetchPayments();
      } else {
        alert("Failed to delete payment.");
      }
    } catch (err) {
      console.error("Error deleting payment:", err);
      alert("Something went wrong while deleting.");
    } finally {
      setDeletingId("");
    }
  };

  const totalAmount = filteredPayments.reduce((total, payment) => {
    const amount = Number(payment.amount);
    return !isNaN(amount) ? total + amount : total;
  }, 0);

  // Search bar: letters only
  const handleSearch = (e) => {
    // Allow only letters and spaces
    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setSearchTerm(lettersOnly);

    if (!lettersOnly) {
      setFilteredPayments(payments);
      return;
    }

    const filtered = payments.filter(
      (payment) =>
        payment.name.toLowerCase().includes(lettersOnly.toLowerCase()) ||
        payment.vType.toLowerCase().includes(lettersOnly.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  // PDF download function
  const downloadPDF = () => {
    if (filteredPayments.length === 0) {
      alert("No payment records to export!");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("EV Payment Records - Dasu Fuel Station, Galle", 14, 22);

    const columns = [
      { header: "#", dataKey: "no" },
      { header: "Name", dataKey: "name" },
      { header: "Card", dataKey: "card" },
      { header: "Vehicle Type", dataKey: "vType" },
      { header: "Amount", dataKey: "amount" },
      { header: "Expiry", dataKey: "expdate" },
      { header: "CVV", dataKey: "cvv" },
    ];

    const rows = filteredPayments.map((payment, index) => ({
      no: index + 1,
      name: payment.name,
      card: ".".repeat(payment.card.length),
      vType: payment.vType,
      amount: `Rs. ${payment.amount}`,
      expdate: payment.expdate,
      cvv: ".".repeat(payment.cvv.length),
    }));

    autoTable(doc, {
      startY: 30,
      columns,
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14, right: 14 },
    });

    const finalY = doc.lastAutoTable?.finalY || 40;
    doc.setFontSize(14);
    doc.text(`Total Amount: Rs. ${totalAmount}`, 14, finalY + 10);

    doc.save("EV_Payment_Report.pdf");
  };

  return (
    <div className="ev-list-container">
      <nav className="payment-list-navbar">
        <div className="payment-navbar-name">
          <h1>Dasu Fuel Station, Galle.</h1>
        </div>

        <div className="payment-navbar-links">
          <Link to="/">Home</Link>
          <Link to="/evlog">Login</Link>
        </div>
      </nav>

      <div className="ev-list-logo">
        <img src={logo} alt="Logo" />
      </div>

      <h2>EV Income Records</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Name or Vehicle Type"
        value={searchTerm}
        onChange={handleSearch}
        className="payment-search-bar"
      />

      {loading && <p>Loading payments...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && filteredPayments.length === 0 && (
        <p>No payment records found.</p>
      )}

      {!loading && filteredPayments.length > 0 && (
        <>
          <div className="table-wrapper">
            <table className="ev-list-table">
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Customer Name</th>
                  <th>Card</th>
                  <th>Vehicle Type</th>
                  <th>Amount</th>
                  <th>Expiry</th>
                  {/*<th>CVV</th>*/}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <tr key={payment._id}>
                    <td>{index + 1}</td>
                    <td>{payment.name}</td>
                    <td>{'.'.repeat(payment.card.length)}</td>
                    <td>{payment.vType}</td>
                    <td>Rs. {payment.amount}</td>
                    <td>{'.'.repeat(payment.expdate.length)}</td>
                    {/*<td>{'.'.repeat(payment.cvv.length)}</td>*/}
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(payment._id)}
                        disabled={deletingId === payment._id}
                      >
                        {deletingId === payment._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan="4"><strong>Total</strong></td>
                  <td colSpan="4"><strong>Rs. {totalAmount}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="download-pdf-btn" onClick={downloadPDF}>Download EV Income Report</button>
        </>
      )}
    </div>
  );
}

export default EVPaymentList;
