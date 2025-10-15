// src/pages/FeedbackDisplayPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./FeedbackDisplayPage.css";

function FeedbackDisplayPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filterSection, setFilterSection] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/feedbacks");
      setFeedbacks(res.data.feedbacks || []);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`http://localhost:5000/feedbacks/${id}`);
        // update locally without full reload
        setFeedbacks((prev) => prev.filter((f) => f._id !== id));
      } catch (error) {
        console.error("Failed to delete feedback:", error);
      }
    }
  };

  const displayedFeedbacks = feedbacks.filter((f) => {
    const matchSection = filterSection ? f.section === filterSection : true;
    const matchDate = searchDate
      ? new Date(f.createdAt).toISOString().slice(0, 10) === searchDate
      : true;
    return matchSection && matchDate;
  });

  // Build a PDF from a list of feedback rows
  const buildPdf = (rowsSource, titleSuffix = "") => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const now = new Date();
    const stamp = now.toLocaleString();

    // Header
    doc.setFontSize(16);
    doc.text("Dasu Filling Station, Galle", 40, 40);
    doc.setFontSize(12);
    doc.text(`Feedback Report ${titleSuffix ? `(${titleSuffix})` : ""}`, 40, 62);
    doc.text(`Generated: ${stamp}`, 40, 78);

    // Filters summary
    const filterSummary =
      `Section: ${filterSection || "All"} | Date: ${searchDate || "All"}`;
    doc.text(filterSummary, 40, 94);

    // Table data
    const columns = [
      { header: "Name", dataKey: "name" },
      { header: "Email", dataKey: "gmail" },
      { header: "Section", dataKey: "section" },
      { header: "Contact", dataKey: "contact" },
      { header: "Message", dataKey: "message" },
      { header: "Date", dataKey: "date" },
    ];

    const rows = rowsSource.map((fb) => ({
      name: fb.name || "-",
      gmail: fb.gmail || "-",
      section: fb.section || "-",
      contact: fb.contact || "-",
      message: fb.message || "-",
      date: fb.createdAt
        ? new Date(fb.createdAt).toLocaleDateString()
        : "-",
    }));

    // Use plugin as a function, not doc.autoTable(...)
    autoTable(doc, {
      startY: 112,
      columns,
      body: rows,
      styles: { fontSize: 10, cellPadding: 6, overflow: "linebreak" },
      headStyles: { halign: "left" },
      bodyStyles: { valign: "top" },
      columnStyles: { message: { cellWidth: 220 } },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          data.settings.margin.left,
          doc.internal.pageSize.getHeight() - 14
        );
      },
    });

    const fileTag = titleSuffix
      ? titleSuffix.replace(/\s+/g, "_").toLowerCase()
      : "all";
    doc.save(`feedback_report_${fileTag}_${now.toISOString().slice(0, 10)}.pdf`);
  };

  const handleDownloadAllPDF = () => {
    if (!feedbacks.length) {
      alert("No feedbacks to export.");
      return;
    }
    buildPdf(feedbacks, "All Feedback");
  };

  const handleDownloadFilteredPDF = () => {
    if (!displayedFeedbacks.length) {
      alert("No filtered feedbacks to export.");
      return;
    }
    buildPdf(displayedFeedbacks, "Filtered View");
  };

  return (
    <div className="feedbacklist-display-page">
      {/* Navbar */}
      <nav className="feedbacklist-display-navbar">
        <a href="/" className="feedbacknav-title">Dasu Filling Station, Galle</a>
        <div className="nav-links">
          <a href="/admin">Admin</a>
          <a href="/">Logout</a>
        </div>
      </nav>

      {/* Actions Row */}
      <div className="feedbacklist-actions">
        <div className="feedbacklist-filters">
          <div>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
            >
              <option value="">All Sections</option>
              <option value="EV Section">EV Section</option>
              <option value="Bulk Order Section">Bulk Order Section</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            {searchDate && (
              <button onClick={() => setSearchDate("")}>Clear</button>
            )}
          </div>
        </div>

        {/* PDF buttons */}
        <div className="feedbacklist-export">
          <button onClick={handleDownloadFilteredPDF}>
            Download PDF (Filtered)
          </button>
          <button onClick={handleDownloadAllPDF}>
            Download PDF (All)
          </button>
        </div>
      </div>

      {/* Feedback Cards */}
      <div className="feedbacklist-cards-container">
        {displayedFeedbacks.length === 0 ? (
          <p className="no-feedback-msg">No feedbacks available.</p>
        ) : (
          displayedFeedbacks.map((fb) => (
            <div key={fb._id} className="feedbacklist-card">
              <h3>{fb.name}</h3>
              <p><strong>Email:</strong> {fb.gmail}</p>
              <p><strong>Section:</strong> {fb.section}</p>
              <p><strong>Contact:</strong> {fb.contact}</p>
              <p><strong>Message:</strong> {fb.message}</p>
              {fb.createdAt && (
                <p className="feedbacklist-date">
                  📅 {new Date(fb.createdAt).toLocaleDateString()}
                </p>
              )}
              <button
                className="delete-btn"
                onClick={() => handleDelete(fb._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FeedbackDisplayPage;
