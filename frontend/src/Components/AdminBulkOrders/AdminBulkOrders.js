import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminBulkOrders.css"; 
import logo from '../../assets/f2.png';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminBulkOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");


  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/api/bulkorders/all");
      if (res.data.status === "ok") {
        setOrders(res.data.data);
      } else {
        setError(res.data.message || "Failed to load orders");
      }
    } catch (err) {
      setError("Error loading orders");
    } finally {
      setLoading(false);
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, action) => {
    if (action === "cancel" && !window.confirm("Are you sure you want to cancel this order?")) return;
    if (action === "undo" && !window.confirm("Are you sure you want to undo the confirmation?")) return;

    setProcessingId(orderId);
    try {
      let url = "";
      if (action === "confirm") {
        url = `http://localhost:5000/api/bulkorders/confirm/${orderId}`;
      } else if (action === "cancel") {
        url = `http://localhost:5000/api/bulkorders/reject/${orderId}`;
      } else if (action === "undo") {
        url = `http://localhost:5000/api/bulkorders/undo-confirm/${orderId}`;
      }

      const res = await axios.put(url);
      if (res.data.status === "ok") {
        alert(
          `Order ${
            action === "confirm"
              ? "confirmed"
              : action === "cancel"
              ? "cancelled"
              : "undo successful"
          }`
        );
        fetchOrders();
      } else {
        alert(res.data.message || "Action failed");
        setProcessingId(null);
      }
    } catch {
      alert("Error performing action");
      setProcessingId(null);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order? This cannot be undone.")) return;

    setProcessingId(orderId);
    try {
      const res = await axios.delete(`http://localhost:5000/api/bulkorders/${orderId}`);
      if (res.data.status === "ok") {
        alert("Order deleted successfully");
        fetchOrders();
      } else {
        alert(res.data.message || "Delete failed");
        setProcessingId(null);
      }
    } catch {
      alert("Error deleting order");
      setProcessingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = (order.customerId?.company || order.customerId?.name || "").toLowerCase();
    const fuelType = order.fuelType.toLowerCase();
    const status = order.status.toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesText =
      customerName.includes(search) ||
      fuelType.includes(search) ||
      status.includes(search);

    let matchesDate = true;
    if (searchDate) {
      if (!order.preferredDate) {
        matchesDate = false;
      } else {
        const orderDate = new Date(order.preferredDate);
        const filterDate = new Date(searchDate);
        orderDate.setHours(0, 0, 0, 0);
        filterDate.setHours(0, 0, 0, 0);

        matchesDate = orderDate >= filterDate;
      }
    }

    return matchesText && matchesDate;
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Bulk Orders Report", 14, 15);
    autoTable(doc, {
      head: [['Customer', 'Fuel Type', 'Quantity (L)', 'Preferred Date', 'Status']],
      body: filteredOrders.map(order => [
        order.customerId?.company || order.customerId?.name || "N/A",
        order.fuelType,
        order.quantity,
        order.preferredDate ? new Date(order.preferredDate).toLocaleDateString() : "-",
        order.status
      ]),
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 123, 255] }
    });
    doc.save("Bulk_Orders_Report.pdf");
  };

  if (error) return <p className="error-text">{error}</p>;
  if (!loading && filteredOrders.length === 0) return <p className="no-orders-text">No orders match your search.</p>;

  return (
    <div className="admin-bulk-orders">

      {/* Navbar */}
      <nav className="bulk-navbar">
        <div className="bulk-nav-logo">
          <span>Dasu Filling Station, Galle</span>
        </div>
        <ul className="bulk-nav-links">
          <li><a href="/admin">Admin</a></li>
          <li><a href="/">Logout</a></li>
        </ul>
      </nav>

      <div className="bulk-logo-container">
        <img src={logo} alt="Company Logo" className="bulk-logo" />
      </div>

      <h2 className="border-title">All Bulk Orders.</h2>

      {/* Search  */}
      <div className="bulk-search-controls">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="bulk-date-input"
        />
        <div>
        <button className="btn btn-download" onClick={downloadPDF}>
          Download PDF
        </button>
        </div>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Fuel Type</th>
            <th>Quantity (L)</th>
            <th>Preferred Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td>{order.customerId?.company || order.customerId?.name || "N/A"}</td>
              <td>{order.fuelType}</td>
              <td>{order.quantity}</td>
              <td>{order.preferredDate ? new Date(order.preferredDate).toLocaleDateString() : "-"}</td>
              <td>{order.status}</td>
              <td>
                {order.status === "pending" ? (
                  <>
                    <button
                      className="btn btn-confirm"
                      onClick={() => updateOrderStatus(order._id, "confirm")}
                      disabled={processingId === order._id}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-cancel"
                      onClick={() => updateOrderStatus(order._id, "cancel")}
                      disabled={processingId === order._id}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteOrder(order._id)}
                      disabled={processingId === order._id}
                    >
                      Delete
                    </button>
                  </>
                ) : order.status === "confirmed" ? (
                  <>
                    <button
                      className="btn btn-undo"
                      onClick={() => updateOrderStatus(order._id, "undo")}
                      disabled={processingId === order._id}
                    >
                      Undo
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteOrder(order._id)}
                      disabled={processingId === order._id}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <span className="no-actions">No actions</span>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteOrder(order._id)}
                      disabled={processingId === order._id}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBulkOrders;
