import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateFactory.css';
import logo from '../../assets/f2.png'; 

function UpdateFactory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [factory, setFactory] = useState({
    name: '',
    gmail: '',
    password: '',
    company: '',
    address: '',
    contact: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchFactory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/factory/getFactory/${id}`);
        if (res.data.status === 'ok') {
          setFactory(res.data.data);
          setError(null);
        } else {
          setError(res.data.message || 'Error fetching factory');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching factory');
      } finally {
        setLoading(false);
      }
    };

    fetchFactory();
  }, [id]);

  const handleChange = (e) => {
    setFactory({ ...factory, [e.target.name]: e.target.value.trimStart() });
  };

  const validate = () => {
    let newErrors = {};

    // Owner Name
    if (!factory.name.trim()) {
      newErrors.name = "Owner name is required";
    } else if (!/^[A-Za-z\s]+$/.test(factory.name)) {
      newErrors.name = "Name cannot contain numbers or symbols";
    }

    // Email
    if (!factory.gmail.trim()) {
      newErrors.gmail = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(factory.gmail)) {
      newErrors.gmail = "Email must be in format example@gmail.com";
    }

    // Password
    if (!factory.password) {
      newErrors.password = "Password is required";
    } else if (factory.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    // Contact
    if (!factory.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^[0-9]{10,15}$/.test(factory.contact)) {
      newErrors.contact = "Contact number must be 10 to 15 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.put(`http://localhost:5000/factory/updateFactory/${id}`, factory);
      if (res.data.status === 'ok') {
        alert('Factory updated successfully');
        navigate(`/factory/profile/${id}`);
      } else {
        alert(res.data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating factory');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="update-factory-wrapper">
      <img src={logo} alt="Logo" className="profile-logo" />
      <div className="update-factory-glass-card">
        <h2>Update Customer Details</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Owner Name:</label>
            <input
              type="text"
              name="name"
              value={factory.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="gmail"
              value={factory.gmail}
              onChange={handleChange}
            />
            {errors.gmail && <p className="error">{errors.gmail}</p>}
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={factory.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div>
            <label>Company Name:</label>
            <input
              type="text"
              name="company"
              value={factory.company}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={factory.address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={factory.contact}
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

export default UpdateFactory;
