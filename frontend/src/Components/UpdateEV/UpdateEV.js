import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/f2.png';
import './UpdateEV.css';

function UpdateEV() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ev, setEV] = useState({
    name: '',
    gmail: '',
    password: '',
    vtype: '',
    address: '',
    contact: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEV = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/ev/getEV/${id}`);
        if (res.data.status === 'ok') {
          setEV(res.data.data);
          setError(null);
        } else {
          setError(res.data.message || 'Error fetching ev');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching ev');
      } finally {
        setLoading(false);
      }
    };

    fetchEV();
  }, [id]);

  const handleChange = (e) => {
    setEV({ ...ev, [e.target.name]: e.target.value.trimStart() });
  };

  const validate = () => {
    let newErrors = {};

    // Name: only letters and spaces
    if (!ev.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (!/^[A-Za-z\s]+$/.test(ev.name)) {
      newErrors.name = "Name cannot contain numbers or symbols";
    }

    // Email: must end with @gmail.com
    if (!ev.gmail.trim()) {
      newErrors.gmail = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(ev.gmail)) {
      newErrors.gmail = "Email must be in format example@gmail.com";
    }

    // Password: at least 4 characters
    if (!ev.password) {
      newErrors.password = "Password is required";
    } else if (ev.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    // Contact: 10–15 digits
    if (!ev.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^[0-9]{10,15}$/.test(ev.contact)) {
      newErrors.contact = "Contact number must be 10 to 15 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // stop if validation fails

    try {
      const res = await axios.put(`http://localhost:5000/ev/updateEV/${id}`, ev);
      if (res.data.status === 'ok') {
        alert('EV updated successfully');
        navigate(`/ev/profile/${id}`);
      } else {
        alert(res.data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating ev');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="update-ev-wrapper">
      <img src={logo} alt="Logo" className="profile-logo" />
      <div className="update-ev-glass-card">
        <h2>Update Customer Details</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Owner Name:</label>
            <input
              type="text"
              name="name"
              value={ev.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="gmail"
              value={ev.gmail}
              onChange={handleChange}
            />
            {errors.gmail && <p className="error">{errors.gmail}</p>}
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={ev.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div>
            <label>Vehicle Type:</label>
            <select
              name="vtype"
              value={ev.vtype}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={ev.address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={ev.contact}
              onChange={handleChange}
            />
            {errors.contact && <p className="error">{errors.contact}</p>}
          </div>

          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateEV;
