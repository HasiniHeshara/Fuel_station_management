// src/pages/AllAppointments.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/f2.png";
import "./AllAppointments.css";
import { FaSearch } from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/appoinment/getAppoinments");
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
        setMessage("Error loading appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await axios.delete(`http://localhost:5000/appoinment/delete/${id}`);
        setAppointments((prev) => prev.filter((item) => item._id !== id));
        setMessage("Appointment deleted.");
      } catch (err) {
        setMessage("Failed to delete.");
      }
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("All EV Appointments", 14, 15);

    const tableColumn = ["Name", "Email", "Vehicle", "Date", "Time Slot"];
    const tableRows = [];

    appointments.forEach((item) => {
      const rowData = [
        item.name,
        item.gmail,
        item.vtype,
        item.date,
        item.slot,
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save("All_EV_Appointments.pdf");
  };

  const filteredAppointments = appointments.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.gmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vtype.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="all-appointments-wrapper">
      <div className="appointments-navbar-unique">
        <h2 className="appointments-navbar-title">Dasu Filling Station, Galle.</h2>
        <button className="appointments-home-btn" onClick={() => navigate("/admin")}>Admin</button>
      </div>

      <div className="all-appointments-container">
        <img src={logo} alt="Logo" className="appointments-logo" />
        <h2>All EV Appointments</h2>

        <div>
          <button onClick={downloadPDF} className="appo-pdf-btn">Download PDF</button>
        </div>

        <div className="search-bar-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email or vehicle type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {message && <p className="message">{message}</p>}
        {loading ? (
          <p className="loading"></p>
        ) : filteredAppointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.gmail}</td>
                  <td>{item.vtype}</td>
                  <td>{item.date}</td>
                  <td>{item.slot}</td>
                  <td>
                    {/*<button onClick={() => navigate(`/appoinment/profile/${item._id}`)}>View</button>*/}
                    {/*<button onClick={() => navigate(`/appoinment/update/${item._id}`)}>Edit</button> */}
                    <button onClick={() => handleDelete(item._id)} className="delete-btn">Delete</button>
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

export default AllAppointments;
