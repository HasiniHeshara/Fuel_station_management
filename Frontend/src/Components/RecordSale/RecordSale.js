import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './RecordSale.css';
import logo from '../../assets/f2.png';

function RecordSale() {
  const navigate = useNavigate();

  const [types, setTypes] = useState([]);
  const [attendants, setAttendants] = useState([]); // [{ _id, name, role, contact, ... }]

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    soldQuantity: '',
    staff: '' // will hold the attendant's _id (ObjectId)
  });

  useEffect(() => {
    // Fetch fuel types
    axios.get('http://localhost:5000/stocks/fuelLevels')
      .then(res => {
        const fuelTypes = (res.data?.storage || []).map(item => item.type);
        setTypes(fuelTypes);
      })
      .catch(err => console.error('Error fetching fuel types', err));

    // Fetch attendants by role (server-side filter)
    axios.get('http://localhost:5000/members/role/petrol%20station%20attendant')
      .then(res => {
        setAttendants(res.data?.members || []);
      })
      .catch(async (err) => {
        console.warn('Role route not found, falling back to /members', err?.response?.status);
        // Fallback: fetch all and filter on client
        try {
          const all = await axios.get('http://localhost:5000/members');
          const onlyAttendants = (all.data?.members || []).filter(
            m => (m.role || '').toLowerCase().trim() === 'petrol station attendant'
          );
          setAttendants(onlyAttendants);
        } catch (e2) {
          console.error('Error fetching attendants', e2);
          setAttendants([]);
        }
      });
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.type || !form.soldQuantity || !form.staff) {
      alert('Please fill all fields');
      return;
    }
    if (Number(form.soldQuantity) < 0) {
      alert('Sold quantity must be non-negative');
      return;
    }

    try {
      const payload = {
        date: form.date,
        type: form.type,
        soldQuantity: Number(form.soldQuantity),
        staff: form.staff, // attendant ObjectId
      };

      // Quick sanity log (can remove later)
      console.log('Submitting sale payload:', payload);

      const res = await axios.post('http://localhost:5000/sales', payload);
      console.log('Sale response:', res.data);
      alert('Sale recorded successfully');

      setForm(prev => ({ ...prev, soldQuantity: '', staff: '' }));
      navigate('/admin');
    } catch (err) {
      console.error('Error recording sale:', err?.response?.data || err.message);
      alert(err?.response?.data?.message || 'Failed to record sale');
    }
  };

  const labelize = (s) =>
    s?.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="record-sale-page">
      {/* Custom Navbar */}
      <nav className="record-navbar">
        <div className="nav-left">
          <h2 className="brand-name">Dasu Filling Station,Galle</h2>
        </div>
        <div className="nav-right">
          <Link to="/">Home</Link>
          <Link to="/sales">View Sales</Link>
          <Link to="/summary">Summary</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/">Logout</Link>
        </div>
      </nav>

      <img src={logo} alt="Fuel Logo" className="record-logo" />
      <div className="record-content">
        <h2>📝 Record Daily Fuel Sale</h2>

        <form onSubmit={handleSubmit} className="sale-form" noValidate>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <label>Fuel Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="">-- Select Type --</option>
            {types.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>

          <label>Sold Quantity (Liters)</label>
          <input
            type="number"
            name="soldQuantity"
            value={form.soldQuantity}
            onChange={handleChange}
            min="0"
          />

          <label>Staff (Petrol Station Attendant)</label>
          <select
            name="staff"
            value={form.staff}
            onChange={handleChange}
          >
            <option value="">-- Select Attendant --</option>
            {attendants.map(att => (
              <option key={att._id} value={att._id}>
                {labelize(att.name)}{att.contact ? ` (${att.contact})` : ''}
              </option>
            ))}
          </select>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default RecordSale;
