import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './EVRegister.css';
import logo from '../../assets/f2.png'; 

function EVRegister() {
  const [formData, setFormData] = useState({
    name: '',
    gmail: '',
    password: '',
    vtype: 'Car',
    address: '',
    contact: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trimStart() });
  };

  const validate = () => {
    let newErrors = {};

    // Name: only letters and spaces
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name cannot contain numbers or symbols";
    }

    // Email: must end with @gmail.com
    if (!formData.gmail.trim()) {
      newErrors.gmail = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.gmail)) {
      newErrors.gmail = "Email must be in format example@gmail.com";
    }

    // Password: at least 4 characters
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    // Contact: must be 10–15 digits
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^[0-9]{10,15}$/.test(formData.contact)) {
      newErrors.contact = "Contact number must be 10 to 15 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // stop if validation fails

    try {
      const res = await axios.post('http://localhost:5000/ev/evregister', formData);
      alert(res.data.message);
      navigate('/evlog');
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed');
    }
  };

  return (
    <div className="ev-register-page">
      {/* Page-specific Navbar */}
      <nav className="ev-navbar">
        <div className="ev-navbar-logo">
          <img src={logo} alt="Logo" />
          <span>Dasu Filling Station, Galle.</span>
        </div>
        <div className="ev-navbar-links">
          <Link to="/">Home</Link>
          <Link to="/evlog">Login</Link>
        </div>
      </nav>

      <div className="ev-register-container">
        <div className="ev-form-header">
          <img src={logo} alt="EV Logo" className="ev-logo" />
          <h2 className="ev-form-title">Register Your EV.</h2>
        </div>
        <form className="ev-register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="gmail"
              value={formData.gmail}
              onChange={handleChange}
            />
            {errors.gmail && <p className="error">{errors.gmail}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Vehicle Type</label>
            <select
              name="vtype"
              value={formData.vtype}
              onChange={handleChange}
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
            {errors.contact && <p className="error">{errors.contact}</p>}
          </div>

          <button type="submit" className="ev-submit-btn">Register</button>
        </form>
      </div>
    </div>
  );
}

export default EVRegister;
