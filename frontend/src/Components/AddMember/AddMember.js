import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AddMember.css';
import logo from '../../assets/f2.png';

const ROLE_OPTIONS = [
  'manager',
  'admin',
  'petrol station attendant',
  'technician',
];

function AddMember() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: '',
    gmail: '',
    password: '',
    role: '',
    age: '',
    address: '',
    contact: '',
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
      newErrors.name = 'Full name is required';
    } else if (!/^[A-Za-z\s]+$/.test(inputs.name)) {
      newErrors.name = 'Name cannot contain numbers or symbols';
    }

    // Email: must end with @gmail.com
    if (!inputs.gmail.trim()) {
      newErrors.gmail = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(inputs.gmail)) {
      newErrors.gmail = 'Email must be in format example@gmail.com';
    }

    // Password: at least 4 characters
    if (!inputs.password) {
      newErrors.password = 'Password is required';
    } else if (inputs.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    // Role: must be one of the dropdown values
    if (!inputs.role) {
      newErrors.role = 'Role is required';
    } else if (!ROLE_OPTIONS.includes(inputs.role)) {
      newErrors.role = 'Please select a valid role';
    }

    // Age: number between 18 and 70
    if (!inputs.age) {
      newErrors.age = 'Age is required';
    } else if (!/^[0-9]+$/.test(inputs.age)) {
      newErrors.age = 'Age must be a number';
    } else if (Number(inputs.age) < 18 || Number(inputs.age) > 70) {
      newErrors.age = 'Age must be between 18 and 70';
    }

    // Contact: 10–15 digits
    if (!inputs.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^[0-9]{10,15}$/.test(inputs.contact)) {
      newErrors.contact = 'Contact number must be 10 to 15 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post('http://localhost:5000/members', inputs);
      const memberId = res?.data?.member?._id;
      if (!memberId) throw new Error('No member ID returned');
      alert('Member added successfully');
      navigate('/displaymember');
    } catch (err) {
      console.error(err);
      alert('Error adding member. Please check console for details.');
    }
  };

  // Pretty label for multi-word lower-case option
  const labelize = (s) =>
    s
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  return (
    <div className="addfuelstaff-page">
      <nav className="addfuelstaff-navbar">
        <Link to="/" className="nav-logo">FuelFlow Station, Galle.</Link>
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

        <form onSubmit={handleSubmit} className="addfuelstaff-form" noValidate>
          {/* Name */}
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

          {/* Gmail */}
          <div className="form-group">
            <label htmlFor="gmail">Email Address:</label>
            <input
              type="email"
              id="gmail"
              name="gmail"
              onChange={handleChange}
              value={inputs.gmail}
              autoComplete="off"
              placeholder="example@gmail.com"
            />
            {errors.gmail && <p className="error">{errors.gmail}</p>}
          </div>

          {/* Password */}
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

          {/* Role dropdown */}
          <div className="form-group">
            <label htmlFor="role">Role / Job Title:</label>
            <select
              id="role"
              name="role"
              value={inputs.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a role
              </option>
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {labelize(opt)}
                </option>
              ))}
            </select>
            {errors.role && <p className="error">{errors.role}</p>}
          </div>

          {/* Age */}
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              onChange={handleChange}
              value={inputs.age}
              min="18"
              max="70"
            />
            {errors.age && <p className="error">{errors.age}</p>}
          </div>

          {/* Address */}
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

          {/* Contact */}
          <div className="form-group">
            <label htmlFor="contact">Contact Number:</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              onChange={handleChange}
              value={inputs.contact}
              autoComplete="off"
              placeholder="07XXXXXXXX"
            />
            {errors.contact && <p className="error">{errors.contact}</p>}
          </div>

          <button type="submit" className="submit-btn">Add Staff</button>
        </form>
      </div>
    </div>
  );
}

export default AddMember;
