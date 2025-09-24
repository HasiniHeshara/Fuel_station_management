import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './UpdateMember.css';
import logo from '../../assets/f2.png';

function UpdateMember() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    gmail: "",
    password: "",
    role: "",
    age: "",
    address: "",
    contact: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/members/${id}`);
        setForm(res.data.member);
      } catch (err) {
        console.log("Error fetching member:", err);
      }
    };
    fetchMember();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trimStart() });
  };

  const validate = () => {
    let newErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.name)) {
      newErrors.name = "Name cannot contain numbers or symbols";
    }

    // Email validation
    if (!form.gmail.trim()) {
      newErrors.gmail = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.gmail)) {
      newErrors.gmail = "Email must be in format example@gmail.com";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    // Age validation
    if (!form.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(form.age) || form.age <= 0) {
      newErrors.age = "Age must be a positive number";
    }

    // Contact validation
    if (!form.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^[0-9]{10,15}$/.test(form.contact)) {
      newErrors.contact = "Contact number must be 10 to 15 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.put(`http://localhost:5000/members/${id}`, form);
      alert("Member updated successfully!");
      navigate("/displaymember");
    } catch (err) {
      console.log("Update failed:", err);
    }
  };

  return (
    <div className="update-member-page">
      <div className="update-member-container">
        <img src={logo} alt="Logo" className="update-member-logo" />
        <h2>Update Member Details</h2>
        <form onSubmit={handleSubmit} className="update-member-form">
          
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input name="name" id="name" value={form.name} onChange={handleChange} />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="gmail">Email:</label>
            <input name="gmail" id="gmail" type="email" value={form.gmail} onChange={handleChange} />
            {errors.gmail && <p className="error">{errors.gmail}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input name="password" id="password" type="password" value={form.password} onChange={handleChange} />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role / Job Title:</label>
            <input name="role" id="role" value={form.role} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input name="age" id="age" type="number" value={form.age} onChange={handleChange} />
            {errors.age && <p className="error">{errors.age}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input name="address" id="address" value={form.address} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number:</label>
            <input name="contact" id="contact" type="tel" value={form.contact} onChange={handleChange} />
            {errors.contact && <p className="error">{errors.contact}</p>}
          </div>

          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateMember;
