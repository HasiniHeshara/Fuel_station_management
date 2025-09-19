import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/f2.png';
import './DailyIncomeSummary.css';

function DailySummary() {
  const [sales, setSales] = useState([]);
  const [prices, setPrices] = useState({});
  const [status, setStatus] = useState({});
  const [searchDate, setSearchDate] = useState(""); 

  useEffect(() => {
    axios.get("http://localhost:5000/sales")
      .then(res => setSales(res.data.sales))
      .catch(err => console.error("Failed to fetch sales", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/fuelprices/dailyfuelprices")
      .then(res => {
        const pricesArray = res.data.prices || [];
        const loadedPrices = {};
        pricesArray.forEach(({ date, type, pricePerLiter }) => {
          if (!loadedPrices[date]) loadedPrices[date] = {};
          loadedPrices[date][type] = pricePerLiter.toString();
        });
        setPrices(loadedPrices);
      })
      .catch(err => console.error("Failed to fetch prices", err));
  }, []);

  const handlePriceChange = (date, fuelType, value) => {
    setPrices(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [fuelType]: value
      }
    }));
  };

  const getDailySummary = () => {
    const summary = {};
    sales.forEach(({ date, type, soldQuantity }) => {
      if (!summary[date]) summary[date] = {};
      if (!summary[date][type]) summary[date][type] = { totalLiters: 0, income: 0 };

      const qty = parseFloat(soldQuantity) || 0;
      const price = parseFloat(prices[date]?.[type]) || 0;

      summary[date][type].totalLiters += qty;
      summary[date][type].income += qty * price;
    });
    return summary;
  };

  const handleSavePrices = async (date) => {
    const fuelTypes = prices[date];
    if (!fuelTypes) return;

    try {
      await Promise.all(Object.entries(fuelTypes).map(([type, pricePerLiter]) =>
        axios.post("http://localhost:5000/fuelprices/dailyfuelprices", {
          type,
          pricePerLiter: parseFloat(pricePerLiter),
          date
        })
      ));
      setStatus(prev => ({ ...prev, [date]: "✅ Prices saved for " + date }));
    } catch (error) {
      console.error("Failed to save prices", error);
      setStatus(prev => ({ ...prev, [date]: "Error saving prices." }));
    }
  };

  const downloadPdf = (date, fuels) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Daily Sales Summary for ${date}`, 14, 20);

    const tableColumn = ["Fuel Type", "Total Liters Sold", "Income (Rs)"];
    const tableRows = [];

    Object.entries(fuels).forEach(([fuelType, data]) => {
      tableRows.push([
        fuelType,
        data.totalLiters.toFixed(2),
        data.income.toFixed(2),
      ]);
    });

    const totalLiters = Object.values(fuels).reduce((sum, f) => sum + f.totalLiters, 0);
    const totalIncome = Object.values(fuels).reduce((sum, f) => sum + f.income, 0);
    tableRows.push([
      "Total",
      totalLiters.toFixed(2),
      totalIncome.toFixed(2)
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save(`Daily_Sales_Summary_${date}.pdf`);
  };

  const dailySummary = getDailySummary();

  const filteredSummary = searchDate
    ? Object.fromEntries(Object.entries(dailySummary).filter(([date]) => date === searchDate))
    : dailySummary;

  return (
    <div className="sale-records-page">
      <nav className="sale-navbar">
        <Link to="/" className="nav-title">Dasu Filling Station, Galle</Link>
        <div className="nav-links">
          <Link to="/admin">Admin</Link>
          <Link to="/sales">Sales Records</Link>
          <Link to="/">Logout</Link>
        </div>
      </nav>

      <div className="sale-header">
        <img src={logo} alt="Fuel Logo" className="center-logo" />
        <h2 className="sales-title">📊 Daily Sales Summary</h2>
      </div>

      {/* 🔍 Search by date */}
      <div className="search-section">
        <label>Search by Date: </label>
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        {searchDate && (
          <button onClick={() => setSearchDate("")} className="clear-search-btn">
            Clear
          </button>
        )}
      </div>

      <div className="summary-table-card">
        <h3>Daily Sales, Prices & Income Summary</h3>
        {Object.keys(filteredSummary).length === 0 ? (
          <p>No sales data to summarize.</p>
        ) : (
          Object.entries(filteredSummary).map(([date, fuels]) => {
            const totalIncome = Object.values(fuels).reduce((sum, f) => sum + f.income, 0);
            const totalLiters = Object.values(fuels).reduce((sum, f) => sum + f.totalLiters, 0);

            return (
              <div key={date} className="summary-section">
                <h4>{date}</h4>

                <div className="fuel-price-inputs-per-date">
                  <h5>Enter Prices for {date}</h5>
                  {Object.keys(fuels).map(fuelType => (
                    <div key={fuelType} className="fuel-price-input">
                      <label>
                        {fuelType} (Rs):
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder={`Price per liter for ${fuelType}`}
                          value={prices[date]?.[fuelType] || ''}
                          onChange={e => handlePriceChange(date, fuelType, e.target.value)}
                        />
                      </label>
                    </div>
                  ))}
                  <button
                    className="save-price-btn"
                    onClick={() => handleSavePrices(date)}
                  >
                    💾 Save Prices
                  </button>
                  {status[date] && <p className="status-msg">{status[date]}</p>}
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Fuel Type</th>
                      <th>Total Liters Sold</th>
                      <th>Daily Income (Rs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(fuels).map(([fuelType, data]) => (
                      <tr key={fuelType}>
                        <td>{fuelType}</td>
                        <td>{data.totalLiters.toFixed(2)}</td>
                        <td>{data.income.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td><strong>Total</strong></td>
                      <td><strong>{totalLiters.toFixed(2)}</strong></td>
                      <td><strong>{totalIncome.toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </table>

                <button
                  className="download-pdf-btn"
                  onClick={() => downloadPdf(date, fuels)}
                  style={{ marginTop: '1rem' }}
                >
                  📄 Download PDF
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default DailySummary;
