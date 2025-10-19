import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AddSupplier.css';
import logo from '../../assets/f2.png';

const CATEGORY_OPTIONS = [
  'Diesel',
  'Auto Diesel',
  'Petrol 92',
  'Petrol 95',
  'Kerosene',
];

function AddSupplier() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: '',
    company: '',
    gmail: '', // ✅ matches backend field
    contact: '',
    address: '',
    category: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trimStart(),
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Name: only letters and spaces
    if (!inputs.name.trim()) {
      newErrors.name = 'Supplier name is required';
    } else if (!/^[A-Za-z\s]+$/.test(inputs.name)) {
      newErrors.name = 'Name cannot contain numbers or symbols';
    }

    // Company
    if (!inputs.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    // Gmail (email)
    if (!inputs.gmail.trim()) {
      newErrors.gmail = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(inputs.gmail)) {
      newErrors.gmail = 'Enter a valid email address';
    }

    // Contact number
    if (!inputs.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^[0-9]{10,15}$/.test(inputs.contact)) {
      newErrors.contact = 'Contact number must be 10 to 15 digits';
    }

    // Address
    if (!inputs.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Category
    if (!inputs.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post('http://localhost:5000/supplier', inputs);
      const supplierId = res?.data?.supplier?._id;
      if (!supplierId) throw new Error('No supplier ID returned');
      alert('Supplier registered successfully ✅');
      navigate('/displaysupplier');
    } catch (err) {
      console.error('Error adding supplier:', err);
      alert('Error registering supplier. Please check console for details.');
    }
  };

  return (
    <div className="addsupplier-page">
      <nav className="addsupplier-navbar">
        <Link to="/" className="nav-logo">FuelFlow Station, Galle.</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/displaysupplier">Supplier List</Link>
          <Link to="/logout">Logout</Link>
        </div>
      </nav>

      <div className="addsupplier-container">
        <div className="form-header">
          <img src={logo} alt="Station Logo" className="station-logo" />
          <h1 className="addsupplier-title">Dasu Filling Station, Galle.</h1>
          <h2 className="addsupplier-subtitle">Register New Supplier</h2>
        </div>

        <form onSubmit={handleSubmit} className="addsupplier-form" noValidate>
          {/* Supplier Name */}
          <div className="form-group">
            <label htmlFor="name">Supplier Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div> 

          {/* Company */}
          <div className="form-group">
            <label htmlFor="company">Company Name:</label>
            <input
              type="text"
              id="company"
              name="company"
              value={inputs.company}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.company && <p className="error">{errors.company}</p>}
          </div>

          {/* Gmail */}
          <div className="form-group">
            <label htmlFor="gmail">Email Address:</label>
            <input
              type="email"
              id="gmail"
              name="gmail"
              value={inputs.gmail}
              onChange={handleChange}
              autoComplete="off"
              placeholder="example@gmail.com"
            />
            {errors.gmail && <p className="error">{errors.gmail}</p>}
          </div>

          {/* Contact */}
          <div className="form-group">
            <label htmlFor="contact">Contact Number:</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={inputs.contact}
              onChange={handleChange}
              placeholder="07XXXXXXXX"
            />
            {errors.contact && <p className="error">{errors.contact}</p>}
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={inputs.address}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={inputs.category}
              onChange={handleChange}
            >
              <option value="" disabled>Select Category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="error">{errors.category}</p>}
          </div>

          <button type="submit" className="submit-btn">Register Supplier</button>
        </form>
      </div>
    </div>
  );
}

export default AddSupplier;
