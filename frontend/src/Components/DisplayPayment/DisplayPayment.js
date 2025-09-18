import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import './DisplayPayment.css';

function DisplayPayment() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await axios.get('http://localhost:5000/fuelpayments');
        setPayments(res.data.payments);
        setFilteredPayments(res.data.payments);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
      }
    }
    fetchPayments();
  }, []);

  useEffect(() => {
    if (!searchDate) {
      setFilteredPayments(payments);
    } else {
      const filtered = payments.filter(p => {
        const paymentDate = new Date(p.date).toISOString().slice(0, 10);
        return paymentDate === searchDate;
      });
      setFilteredPayments(filtered);
    }
  }, [searchDate, payments]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await axios.delete(`http://localhost:5000/fuelpayments/${id}`);
        const updatedPayments = payments.filter(payment => payment._id !== id);
        setPayments(updatedPayments);
        setFilteredPayments(updatedPayments.filter(p => {
          if (!searchDate) return true;
          const paymentDate = new Date(p.date).toISOString().slice(0, 10);
          return paymentDate === searchDate;
        }));
        alert('Payment deleted successfully!');
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete payment.');
      }
    }
  };

  // ✅ PDF Download Function
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Fuel Payment Report', 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [['Date', 'Fuel Type', 'Quantity (L)', 'Supplier', 'Amount (Rs)']],
      body: filteredPayments.map(p => [
        new Date(p.date).toLocaleDateString(),
        p.type,
        p.quantity,
        p.supplier,
        p.amount.toFixed(2),
      ]),
    });
    doc.save('FuelPaymentsReport.pdf');
  };

  return (
    <div className="d-payment-page-unique">
      <header className="d-payment-header">
        <h1>Payments For Fuel Overview</h1>
        <div>
          <button className="d-back-to-admin-btn" onClick={() => navigate('/admin')}>
            ⬅ Back to Admin Page
          </button>
          <div>
          <button className="d-fuel-download-pdf-btn" onClick={downloadPDF}>
            📄 Download PDF
          </button>
          </div>
        </div>
      </header>

      <div className="d-filter-bar">
        <label htmlFor="search-date">Filter by Date:</label>
        <input
          type="date"
          id="search-date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        {searchDate && (
          <button className="d-clear-btn" onClick={() => setSearchDate('')}>
            Clear
          </button>
        )}
      </div>

      {filteredPayments.length === 0 ? (
        <p className="d-no-payments-msg">No payment records available for the selected date.</p>
      ) : (
        <section className="d-payments-list">
          {filteredPayments.map(p => (
            <article key={p._id} className="d-payment-entry">
              <div className="d-payment-info">
                <div><strong>Date:</strong> {new Date(p.date).toLocaleDateString()}</div>
                <div><strong>Fuel Type:</strong> {p.type}</div>
                <div><strong>Quantity:</strong> {p.quantity} Liters</div>
                <div><strong>Supplier:</strong> {p.supplier}</div>
                <div><strong>Amount:</strong> Rs. {p.amount.toFixed(2)}</div>
              </div>
              <div className="d-payment-controls">
                <button
                  className="d-btn-update"
                  onClick={() => navigate(`/updatepayment/${p._id}`)}
                >
                  Update
                </button>
                <button
                  className="d-btn-delete"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default DisplayPayment;
