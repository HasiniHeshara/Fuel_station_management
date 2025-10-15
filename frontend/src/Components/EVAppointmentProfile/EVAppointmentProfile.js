import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCar,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaHome,
  FaFilePdf,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import logo from "../../assets/f2.png";
import "./EVAppointmentProfile.css";

function AppointmentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/appoinment/getbyid/${id}`);
        setAppointment(res.data);
      } catch (err) {
        setError("Failed to fetch appointment");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await axios.delete(`http://localhost:5000/appoinment/delete/${id}`);
        setMessage("Appointment deleted successfully.");
        setTimeout(() => navigate("/mainhome"), 2000);
      } catch (err) {
        setError("Failed to delete appointment.");
      }
    }
  };

  const handlePayment = () => {
    navigate(`/mainhome`);
  };

  const handleEdit = () => {
    navigate(`/appoinment/update/${id}`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("EV Appointment Details", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Field", "Value"]],
      body: [
        ["Name", appointment.name],
        ["Email", appointment.gmail],
        ["Vehicle Type", appointment.vtype],
        ["Date", appointment.date],
        ["Time Slot", appointment.slot],
      ],
    });

    doc.save("Appointment_Details.pdf");
  };

  if (loading) return <div className="evapp-loading">Loading appointment...</div>;
  if (error) return <div className="evapp-error-msg">{error}</div>;

  return (
    <div className="evapp-page">
      <img src={logo} alt="Logo" className="evapp-logo" />
      <div className="evapp-container">
        <h2 className="evapp-heading">Appointment Profile</h2>

        {message && <p className="evapp-success">{message}</p>}
        {error && <p className="evapp-error">{error}</p>}

        <div className="evapp-card">
          <div className="evapp-info">
            <p><FaUser className="evapp-icon" /> <strong>Name:</strong> {appointment.name}</p>
            <p><FaEnvelope className="evapp-icon" /> <strong>Email:</strong> {appointment.gmail}</p>
            <p><FaCar className="evapp-icon" /> <strong>Vehicle Type:</strong> {appointment.vtype}</p>
            <p><FaCalendarAlt className="evapp-icon" /> <strong>Date:</strong> {appointment.date}</p>
            <p><FaClock className="evapp-icon" /> <strong>Time Slot:</strong> {appointment.slot}</p>
          </div>

          <div className="evapp-actions">
            <button onClick={handlePayment} className="evapp-btn evapp-pay-btn">
              <FaHome /> Home
            </button>
            <button onClick={downloadPDF} className="evapp-btn evapp-pdf-btn">
              <FaFilePdf /> Download PDF
            </button>
            <button onClick={handleEdit} className="evapp-btn evapp-edit-btn">
              Edit
            </button>
            <button onClick={handleDelete} className="evapp-btn evapp-delete-btn">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentProfile;
