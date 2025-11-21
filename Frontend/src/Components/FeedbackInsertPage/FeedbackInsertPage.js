// src/pages/feedback/FeedbackInsertPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/f2.png";
import "./FeedbackInsertPage.css";

function FeedbackInsertPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    gmail: "",
    section: "",
    contact: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({ contact: "" });

  // --- helper for contact validation ---
  const isValidContact = (v) => /^0\d{9}$/.test(v); // e.g., 0712345678

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Normalize contact: keep digits only, max 10 chars
    if (name === "contact") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));

      // live-validate contact
      let msg = "";
      if (digitsOnly.length === 0) msg = "Contact number is required.";
      else if (!isValidContact(digitsOnly))
        msg = "Enter a valid Sri Lankan number (0XXXXXXXXX).";
      setErrors((prev) => ({ ...prev, contact: msg }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    // Final check for contact before submit
    if (!isValidContact(formData.contact)) {
      setErrors((prev) => ({
        ...prev,
        contact: "Enter a valid Sri Lankan number (0XXXXXXXXX).",
      }));
      setStatus("Please fix the contact number and try again.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/feedbacks", formData);
      setStatus("Feedback submitted successfully!");
      setFormData({
        name: "",
        gmail: "",
        section: "",
        contact: "",
        message: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setStatus("Failed to submit feedback.");
    }
  };

  return (
    <div className="feedback-page">
      <nav className="feedback-navbar">
        <a href="/" className="nav-title">Dasu Filling Station, Galle</a>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/feedback">Feedback</a>
          <a href="/">Logout</a>
        </div>
      </nav>

      <div className="feedback-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Feedback Form Card */}
      <div className="feedback-card">
        <h2>
          <FontAwesomeIcon icon={faCommentDots} className="text-blue-500" />
          Submit Your Feedback
        </h2>

        <form onSubmit={handleSubmit} className="feedback-form" noValidate>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="gmail"
            placeholder="Email Address"
            value={formData.gmail}
            onChange={handleChange}
            required
          />

          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
          >
            <option value="">Select Section</option>
            <option value="EV Section">EV Section</option>
            <option value="Bulk Order Section">Bulk Order Section</option>
          </select>

          <div className="form-field">
            <input
              type="tel"
              name="contact"
              placeholder="Contact Number (0XXXXXXXXX)"
              value={formData.contact}
              onChange={handleChange}
              required
              inputMode="numeric"
              maxLength={10}
              aria-invalid={!!errors.contact}
              aria-describedby="contact-error"
            />
            {errors.contact && (
              <span id="contact-error" className="field-error">
                {errors.contact}
              </span>
            )}
          </div>

          <textarea
            name="message"
            placeholder="Your Feedback"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>

          <button type="submit">Submit Feedback</button>
        </form>

        {status && <p className="status-msg">{status}</p>}
      </div>
    </div>
  );
}

export default FeedbackInsertPage;
