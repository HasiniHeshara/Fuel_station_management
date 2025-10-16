// src/pages/sales/UpdateSale.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateSale.css';
import logo from '../../assets/f2.png';

function UpdateSale() {
  const { id } = useParams();
  const navigate = useNavigate();

  // read role; change source if you keep it elsewhere (context/JWT/etc.)
  const role = localStorage.getItem('role');
  const isCustomer = String(role || '').toLowerCase() === 'customer';

  const [attendants, setAttendants] = useState([]);
  const [form, setForm] = useState({
    date: '',
    type: '',
    soldQuantity: '',
    staff: '' // attendant ObjectId
  });
  const [originalDate, setOriginalDate] = useState('');
  const [errors, setErrors] = useState({});

  const FUEL_TYPE_RE = /^[A-Za-z0-9 +]+$/;
  const MAX_QTY = 1_000_000;

  const labelize = (s) =>
    s?.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const isFutureDate = (yyyy_mm_dd) => {
    if (!yyyy_mm_dd) return false;
    const d = new Date(yyyy_mm_dd);
    const t = new Date();
    d.setHours(0,0,0,0); t.setHours(0,0,0,0);
    return d > t;
  };

  const isValidTwoDecimals = (val) => /^\d+(\.\d{1,2})?$/.test(String(val));

  const validate = (values) => {
    const e = {};

    if (!values.date) e.date = 'Date is required.';
    else if (Number.isNaN(Date.parse(values.date))) e.date = 'Invalid date.';
    else if (isFutureDate(values.date)) e.date = 'Date cannot be in the future.';

    const typeTrim = (values.type || '').trim();
    if (!typeTrim) e.type = 'Fuel type is required.';
    else if (!FUEL_TYPE_RE.test(typeTrim)) e.type = 'Only letters, numbers, spaces, and + are allowed.';

    if (values.soldQuantity === '' || values.soldQuantity === null) {
      e.soldQuantity = 'Sold quantity is required.';
    } else {
      const num = Number(values.soldQuantity);
      if (Number.isNaN(num)) e.soldQuantity = 'Sold quantity must be a number.';
      else if (num <= 0) e.soldQuantity = 'Sold quantity must be greater than 0.';
      else if (num > MAX_QTY) e.soldQuantity = `Sold quantity must be ≤ ${MAX_QTY}.`;
      else if (!isValidTwoDecimals(values.soldQuantity)) e.soldQuantity = 'Max 2 decimal places.';
    }

    if (!values.staff) e.staff = 'Please select a staff member.';

    return e;
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/sales/${id}`)
      .then(res => {
        const sale = res.data?.sale || {};
        const staffId = typeof sale.staff === 'object' && sale.staff !== null
          ? sale.staff._id
          : sale.staff || '';
        const dateStr = sale.date ? sale.date.substring(0, 10) : '';
        setForm({
          date: dateStr,
          type: sale.type || '',
          soldQuantity: sale.soldQuantity ?? '',
          staff: staffId
        });
        setOriginalDate(dateStr);
      })
      .catch(err => console.error("Error fetching sale:", err));

    axios.get('http://localhost:5000/members/role/petrol%20station%20attendant')
      .then(res => setAttendants(res.data?.members || []))
      .catch(async () => {
        try {
          const all = await axios.get('http://localhost:5000/members');
          const onlyAttendants = (all.data?.members || []).filter(
            m => (m.role || '').toLowerCase().trim() === 'petrol station attendant'
          );
          setAttendants(onlyAttendants);
        } catch {
          setAttendants([]);
        }
      });
  }, [id]);

  const handleChange = (e) => {
    if (isCustomer && e.target.name === 'date') return; // guard even if user tries via devtools
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    setErrors(validate(next));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      const firstKey = Object.keys(v)[0];
      const el = document.querySelector(`.update-sale-form [name="${firstKey}"]`);
      if (el) el.focus();
      return;
    }

    try {
      const payload = {
        date: isCustomer ? originalDate : form.date,
        type: form.type.trim(),
        soldQuantity: Number(form.soldQuantity),
        staff: form.staff,
      };

      await axios.put(`http://localhost:5000/sales/${id}`, payload, {
        headers: { "Content-Type": "application/json" }
      });

      alert("Sale updated successfully");
      navigate('/sales');
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update sale");
    }
  };

  return (
    <div className="update-sale-page">
      <div className="update-sale-content">
        <img src={logo} alt="Station Logo" className="update-logo" />
        <h2>✏️ Update Sale Record</h2>

        <form onSubmit={handleUpdate} className="update-sale-form" noValidate>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            disabled={isCustomer}
            aria-invalid={!!errors.date}
            aria-describedby="err-date"
          />
          {errors.date && <small id="err-date" className="field-error">{errors.date}</small>}

          <label>Fuel Type</label>
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            maxLength={30}
            aria-invalid={!!errors.type}
            aria-describedby="err-type"
          />
          {errors.type && <small id="err-type" className="field-error">{errors.type}</small>}

          <label>Sold Quantity (Liters)</label>
          <input
            type="number"
            name="soldQuantity"
            value={form.soldQuantity}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
            aria-invalid={!!errors.soldQuantity}
            aria-describedby="err-soldQuantity"
          />
          {errors.soldQuantity && (
            <small id="err-soldQuantity" className="field-error">{errors.soldQuantity}</small>
          )}

          <label>Staff (Petrol Station Attendant)</label>
          <select
            name="staff"
            value={form.staff}
            onChange={handleChange} 
            required
            aria-invalid={!!errors.staff}
            aria-describedby="err-staff"
          >
            <option value="" disabled>-- Select Attendant --</option>
            {attendants.map(att => (
              <option key={att._id} value={att._id}>
                {labelize(att.name)}{att.contact ? ` (${att.contact})` : ''}
              </option>
            ))}
          </select>
          {errors.staff && <small id="err-staff" className="field-error">{errors.staff}</small>}

          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateSale;
