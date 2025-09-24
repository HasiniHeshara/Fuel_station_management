import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './RegisterFactory.css'; 
import logo from '../../assets/f2.png'; 

function FactoryRegister() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    gmail: "",
    password: "",
    company: "",
    address: "",
    contact: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setInputs(prev => ({
      ...prev,
      [e.target.name]: e.target.value.trimStart(),
    }));
  };

  const validate = () => {
    let newErrors = {};

    // Name validation: only letters + spaces
    if (!inputs.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(inputs.name)) {
      newErrors.name = "Name cannot contain numbers or symbols";
    }

    // Email validation: must end with @gmail.com
    if (!inputs.gmail.trim()) {
      newErrors.gmail = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(inputs.gmail)) {
      newErrors.gmail = "Email must be in format example@gmail.com";
    }

    // Password validation: at least 4 characters
    if (!inputs.password) {
      newErrors.password = "Password is required";
    } else if (inputs.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    // Contact validation: 10–15 digits
    if (!inputs.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^[0-9]{10,15}$/.test(inputs.contact)) {
      newErrors.contact = "Contact number must be 10 to 15 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // valid if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // stop if validation fails

    try {
      const res = await axios.post("http://localhost:5000/factory/register", inputs);
      if (res.data.status === 'ok') {
        alert("Factory registered successfully");
        navigate("/flogin");  
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      alert("Error registering factory. Check console for details.");
      console.error(err);
    }
  };

  return (
    <div className="factory-register-page">
      <nav className="factory-register-navbar">
        <Link to="/" className="nav-logo">Dasu Filling Station, Galle.</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/flogin">Login</Link>
        </div>
      </nav>

      <div className="factory-register-container">
        <div className="form-header">
          <img src={logo} alt="Station Logo" className="station-logo" />
          <h1 className="form-title">Commercial Customer Registration</h1>
          <h2 className="form-subtitle">Register You Below</h2>
        </div>

        <form onSubmit={handleSubmit} className="factory-register-form">
          <div className="form-group">
            <label htmlFor="name">Owner's Name:</label>
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
            <label htmlFor="company">Company Name:</label>
            <input
              type="text"
              id="company"
              name="company"
              onChange={handleChange}
              value={inputs.company}
              autoComplete="off"
              required
            />
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
              required
            />
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

          <button type="submit" className="submit-btn">Enter To Register</button>
        </form>
      </div>
    </div>
  );
}

export default FactoryRegister;
