import React, { useState, useEffect } from "react";
import axios from "axios";

const RestMode = () => {
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Controls the dropdown visibility
  
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await axios.get(`${baseURL}/users/holidays`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHolidays(res.data.holidays || []);
      } catch (err) {
        console.error("Failed to fetch holidays:", err);
      }
    };
    fetchHolidays();
  }, [baseURL, token]);

  const handleAddDate = async (e) => {
    e.preventDefault();
    if (!selectedDate || holidays.includes(selectedDate)) return;

    setLoading(true);
    const updatedHolidays = [...holidays, selectedDate].sort();

    try {
      await axios.put(
        `${baseURL}/users/holidays`,
        { holidays: updatedHolidays },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHolidays(updatedHolidays);
      setSelectedDate("");
    } catch (err) {
      console.error("Failed to save holiday:", err);
      alert("Could not save holiday date.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDate = async (dateToRemove) => {
    setLoading(true);
    const updatedHolidays = holidays.filter((d) => d !== dateToRemove);

    try {
      await axios.put(
        `${baseURL}/users/holidays`,
        { holidays: updatedHolidays },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHolidays(updatedHolidays);
    } catch (err) {
      console.error("Failed to remove holiday:", err);
      alert("Could not remove holiday date.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
      {/* Clickable Dropdown Header */}
      <div 
        className="d-flex justify-content-between align-items-center" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        <div>
          <p className="fw-bold mb-0 small text-dark">🌴 Rest Days & Holidays</p>
          <p className="small text-muted mb-0">
            Schedule your breaks to protect your heatmap streaks and set rest boundaries.
          </p>
        </div>
        <span className="text-secondary fs-5">{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* Expandable Content Panel */}
      {isOpen && (
        <div className="mt-4 fade-in">
          <hr className="my-3 opacity-10" />
          
          <form onSubmit={handleAddDate} className="d-flex gap-2 mb-4" style={{ maxWidth: "400px" }}>
            <input
              type="date"
              className="form-control shadow-none border"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn btn-dark px-4 font-weight-bold"
              disabled={loading || !selectedDate}
            >
              Add
            </button>
          </form>

          <div>
            <h6 className="fw-bold text-uppercase text-muted extra-small mb-2" style={{ fontSize: "0.75rem" }}>
              Scheduled Breaks
            </h6>
            {holidays.length === 0 ? (
              <p className="text-muted small mb-0">No rest days scheduled yet.</p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {holidays.map((date) => (
                  <span
                    key={date}
                    className="badge bg-light text-dark border d-flex align-items-center gap-2 px-2.5 py-2 rounded-3 fw-normal"
                    style={{ fontSize: "0.85rem" }}
                  >
                    📅 {new Date(date).toLocaleDateString("en-GB")}
                    <button
                      type="button"
                      className="btn-close shadow-none"
                      style={{ width: "0.5em", height: "0.5em", fontSize: "0.65rem" }}
                      onClick={() => handleRemoveDate(date)}
                      disabled={loading}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestMode;