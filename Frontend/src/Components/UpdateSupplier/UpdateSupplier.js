import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/f2.png';
import './UpdateSupplier.css'; // reuse same styles for a consistent look

function UpdateSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState({
    name: '',
    company: '',
    gmail: '',
    contact: '',
    address: '',
    category: '',
  });

  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/supplier/${id}`);
        const s = res.data?.supplier;
        if (!s) {
          setFetchErr('Supplier not found');
        } else {
          setSupplier({
            name: s.name || '',
            company: s.company || '',
            gmail: s.gmail || '',
            contact: s.contact || '',
            address: s.address || '',
            category: s.category || '',
          });
          setFetchErr(null);
        }
      } catch (err) {
        console.error(err);
        setFetchErr('Error fetching supplier');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  const handleChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value.trimStart() });
  };

  const validate = () => {
    const e = {};

    if (!supplier.name.trim()) {
      e.name = 'Name is required';
    } else if (!/^[A-Za-z\s.]+$/.test(supplier.name)) {
      e.name = 'Name can include letters, spaces and periods only';
    }

    if (!supplier.gmail.trim()) {
      e.gmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplier.gmail)) {
      e.gmail = 'Enter a valid email';
    }

    if (!supplier.contact.trim()) {
      e.contact = 'Contact number is required';
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(supplier.contact)) {
      e.contact = 'Enter a valid phone number';
    }

    if (!supplier.address.trim()) {
      e.address = 'Address is required';
    }

    // Category & company optional; enforce if you want:
    // if (!supplier.category.trim()) e.category = 'Category is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.put(`http://localhost:5000/supplier/${id}`, supplier);
      alert('Supplier updated successfully');
      navigate('/displaysupplier');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Error updating supplier');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (fetchErr) return <p style={{ color: 'red' }}>{fetchErr}</p>;

  return (
    <div className="update-ev-wrapper">
      <img src={logo} alt="Logo" className="profile-logo" />

      <div className="update-ev-glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Update Supplier Details</h2>
          <Link to="/displaysupplier" style={{ color: '#030303ff', textDecoration: 'underline' }}>
            Back to Suppliers
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={supplier.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div>
            <label>Company:</label>
            <input
              type="text"
              name="company"
              value={supplier.company}
              onChange={handleChange}
            />
            {errors.company && <p className="error">{errors.company}</p>}
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="gmail"
              value={supplier.gmail}
              onChange={handleChange}
            />
            {errors.gmail && <p className="error">{errors.gmail}</p>}
          </div>

          <div>
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={supplier.contact}
              onChange={handleChange}
            />
            {errors.contact && <p className="error">{errors.contact}</p>}
          </div>

          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={supplier.address}
              onChange={handleChange}
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>

          <div>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={supplier.category}
              onChange={handleChange}
              placeholder="e.g., Diesel, Petrol, Spare Parts"
            />
            {errors.category && <p className="error">{errors.category}</p>}
          </div>

          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateSupplier;
