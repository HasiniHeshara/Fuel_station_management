import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./AddMember.css";
import logo from "../../assets/f2.png";

function AddMember() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    gmail: "",
    password: "",
    role: "",
    age: "",
    address: "",
    contact: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trimStart(),
    }));
  };

  const validate = () => {
    let newErrors = {};

    // Name: letters and spaces, at least 2 chars
    if (!inputs.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (!/^[A-Za-z\s]{2,}$/.test(inputs.name)) {
      newErrors.name = "Enter a valid name (letters only)";
    }

    // Gmail/Email
    if (!inputs.gmail.trim()) {
      newErrors.gmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.gmail)) {
      newErrors.gmail = "Enter a valid email address";
    }

    // Password: min 6 chars, must contain letters + numbers
    if (!inputs.password) {
      newErrors.password = "Password is required";
    } else if (inputs.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(inputs.password)) {
      newErrors.password = "Password must include letters and numbers";
    }

    // Role: not empty
    if (!inputs.role.trim()) {
      newErrors.role = "Role/Job title is required";
    }

    // Age: 18–70
    if (!inputs.age) {
      newErrors.age = "Age is required";
    } else if (inputs.age < 18 || inputs.age > 70) {
      newErrors.age = "Age must be between 18 and 70";
    }

    // Address: not empty
    if (!inputs.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Contact: 10–15 digits
    if (!inputs.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^[0-9]{10,15}$/.test(inputs.contact)) {
      newErrors.contact = "Contact number must be 10 to 15 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // ✅ true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:5000/members", inputs);
      const memberId = res.data.member._id;
      if (!memberId) throw new Error("No member ID returned");
      alert("Member added successfully");
      navigate(`/memberlogin`);
    } catch (err) {
      alert("Error adding member. Please check console for details.");
      console.error(err);
    }
  };

  return (
    <div className="addfuelstaff-page">
      <nav className="addfuelstaff-navbar">
        <Link to="/" className="nav-logo">
          FuelFlow Station, Galle.
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/displaymember">Staff List</Link>
          <Link to="/logout">Logout</Link>
        </div>
      </nav>

      <div className="addfuelstaff-container">
        <div className="form-header">
          <img src={logo} alt="Dasu Filling Station Logo" className="station-logo" />
          <h1 className="addfuelstaff-title">Dasu Filling Station, Galle.</h1>
          <h2 className="addfuelstaff-subtitle">Add Fuel Station Staff</h2>
        </div>

        <form onSubmit={handleSubmit} className="addfuelstaff-form">
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              value={inputs.name}
              autoComplete="off"
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="gmail">Email Address:</label>
            <input
              type="email"
              id="gmail"
              name="gmail"
              onChange={handleChange}
              value={inputs.gmail}
              autoComplete="off"
            />
            {errors.gmail && <p className="error">{errors.gmail}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={inputs.password}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role / Job Title:</label>
            <input
              type="text"
              id="role"
              name="role"
              onChange={handleChange}
              value={inputs.role}
              autoComplete="off"
            />
            {errors.role && <p className="error">{errors.role}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              onChange={handleChange}
              value={inputs.age}
            />
            {errors.age && <p className="error">{errors.age}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              onChange={handleChange}
              value={inputs.address}
              autoComplete="off"
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number:</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              onChange={handleChange}
              value={inputs.contact}
              autoComplete="off"
            />
            {errors.contact && <p className="error">{errors.contact}</p>}
          </div>

          <button type="submit" className="submit-btn">
            Add Staff
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMember;
