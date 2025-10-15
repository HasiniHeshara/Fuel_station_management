import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./SupplierDisplay.css";
import logo from "../../assets/f2.png";

function SupplierDisplay() {
  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/supplier");
      const rows = res.data?.suppliers || [];
      setSuppliers(rows);
      setFiltered(rows);
    } catch (err) {
      console.error("Error fetching suppliers:", err?.response?.data || err.message);
      setSuppliers([]);
      setFiltered([]);
    }
  };

  useEffect(() => {
    const s = search.toLowerCase();
    const f = suppliers.filter((v) =>
      (v.name || "").toLowerCase().includes(s) ||
      (v.company || "").toLowerCase().includes(s) ||
      (v.gmail || "").toLowerCase().includes(s) ||
      (v.contact || "").toLowerCase().includes(s) ||
      (v.address || "").toLowerCase().includes(s) ||
      (v.category || "").toLowerCase().includes(s)
    );
    setFiltered(f);
  }, [search, suppliers]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;
    try {
      await axios.delete(`http://localhost:5000/supplier/${id}`);
      setSuppliers((prev) => prev.filter((s) => s._id !== id));
      setFiltered((prev) => prev.filter((s) => s._id !== id));
      alert("Supplier deleted");
    } catch (err) {
      console.error("Delete failed:", err?.response?.data || err.message);
      alert("Failed to delete supplier");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Supplier List", 14, 18);

    const tableRows = filtered.map((s, idx) => [
      idx + 1,
      s.name || "",
      s.company || "",
      s.gmail || "",
      s.contact || "",
      s.address || "",
      s.category || "",
    ]);

    autoTable(doc, {
      startY: 26,
      head: [["#", "Name", "Company", "Email", "Contact", "Address", "Category"]],
      body: tableRows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [30, 64, 175] },
    });

    doc.save("Suppliers.pdf");
  };

  return (
    <div className="supplier-root">
      <nav className="supplier-navbar">
        <Link to="/" className="supplier-brand">Dasu Filling Station, Galle</Link>
        <div className="supplier-links">
          <Link to="/addsupplier">Add Supplier</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/mainhome">Logout</Link>
        </div>
      </nav>

      <div className="supplier-container">
        <div className="supplier-header">
          <img src={logo} alt="Logo" className="supplier-logo" />
          <h2>Registered Suppliers</h2>
        </div>

        <div className="supplier-toolbar">
          <input
            type="text"
            placeholder="Search by name, company, email, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="supplier-search"
          />
          <button onClick={downloadPDF} className="btn-glass">
            📄 Download PDF
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="supplier-empty">No suppliers found.</p>
        ) : (
          <div className="supplier-table-wrap">
            <table className="supplier-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s._id}>
                    <td>{i + 1}</td>
                    <td>{s.name}</td>
                    <td>{s.company || "-"}</td>
                    <td>{s.gmail}</td>
                    <td>{s.contact}</td>
                    <td className="td-address">{s.address}</td>
                    <td>{s.category || "-"}</td>
                    <td className="supplier-actions">
                      <Link to={`/updatesupplier/${s._id}`}>
                        <button className="btn-outline">✏ Edit</button>
                      </Link>
                      <button className="btn-danger" onClick={() => handleDelete(s._id)}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupplierDisplay;
