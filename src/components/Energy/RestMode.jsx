import React, { useState, useEffect } from "react";
import axios from "axios";

const RestMode = () => {
  const [holidays, setHolidays] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleAddDateRange = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      alert("End date cannot be before start date.");
      return;
    }

    setLoading(true);

    const newDates = [];
    let current = new Date(start);

    while (current <= end) {
      const dateString = current.toISOString().split("T")[0];
      if (!holidays.includes(dateString)) {
        newDates.push(dateString);
      }
      current.setDate(current.getDate() + 1);
    }

    if (newDates.length === 0) {
      setLoading(false);
      return;
    }

    const updatedHolidays = [...holidays, ...newDates].sort();

    try {
      await axios.put(
        `${baseURL}/users/holidays`,
        { holidays: updatedHolidays },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setHolidays(updatedHolidays);
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error("Failed to save holiday range:", err);
      alert("Could not save holiday dates.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRange = async (dateArray) => {
    setLoading(true);
    const updatedHolidays = holidays.filter((d) => !dateArray.includes(d));

    try {
      await axios.put(
        `${baseURL}/users/holidays`,
        { holidays: updatedHolidays },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setHolidays(updatedHolidays);
    } catch (err) {
      console.error("Failed to remove holiday segment:", err);
      alert("Could not remove holiday.");
    } finally {
      setLoading(false);
    }
  };

  const getSequentialGroups = () => {
    if (holidays.length === 0) return {};

    const groups = {};
    let currentRange = [holidays[0]];

    for (let i = 1; i < holidays.length; i++) {
      const prevDate = new Date(holidays[i - 1]);
      const currDate = new Date(holidays[i]);

      const diffTime = Math.abs(currDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentRange.push(holidays[i]);
      } else {
        const firstDateObj = new Date(currentRange[0]);
        const monthYear = firstDateObj.toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        });
        if (!groups[monthYear]) groups[monthYear] = [];
        groups[monthYear].push(currentRange);

        currentRange = [holidays[i]];
      }
    }

    if (currentRange.length > 0) {
      const firstDateObj = new Date(currentRange[0]);
      const monthYear = firstDateObj.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(currentRange);
    }

    return groups;
  };

  const formattedGroups = getSequentialGroups();

  const formatDateLabel = (dateArray) => {
    const formatDate = (str) => {
      const d = new Date(str);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      });
    };

    if (dateArray.length === 1) {
      return formatDate(dateArray[0]);
    }
    return `${formatDate(dateArray[0])} - ${formatDate(dateArray[dateArray.length - 1])}`;
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
      <div
        className="d-flex justify-content-between align-items-center"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        <div>
          <p className="fw-bold mb-0 small text-dark">Rest Days & Holidays</p>
          <p className="small text-muted mb-0">
            Schedule your breaks to protect your heatmap streaks and set rest
            boundaries.
          </p>
        </div>
        <span className="text-secondary fs-5">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="mt-4 fade-in">
          <hr className="my-3 opacity-10" />

          <form
            onSubmit={handleAddDateRange}
            className="mb-4"
            style={{ maxWidth: "500px" }}
          >
            <div className="d-flex gap-2 align-items-end">
              <div className="flex-grow-1">
                <label
                  className="form-label extra-small text-muted mb-1"
                  style={{ fontSize: "0.75rem" }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  className="form-control shadow-none border"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="flex-grow-1">
                <label
                  className="form-label extra-small text-muted mb-1"
                  style={{ fontSize: "0.75rem" }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control shadow-none border"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={loading || !startDate}
                  min={startDate}
                />
              </div>
              <button
                type="submit"
                className="btn btn-dark px-4 font-weight-bold"
                disabled={loading || !startDate || !endDate}
                style={{ height: "38px" }}
              >
                Add
              </button>
            </div>
          </form>

          <div>
            <h6
              className="fw-bold text-uppercase text-muted extra-small mb-3"
              style={{ fontSize: "0.75rem" }}
            >
              Scheduled Breaks
            </h6>

            {holidays.length === 0 ? (
              <p className="text-muted small mb-0">
                No rest days scheduled yet.
              </p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {Object.keys(formattedGroups).map((monthYear) => (
                  <div key={monthYear} className="border-bottom pb-3">
                    <span
                      className="fw-bold text-secondary d-block mb-2"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {monthYear}
                    </span>
                    <div className="d-flex flex-wrap gap-2">
                      {formattedGroups[monthYear].map((dateArray, index) => (
                        <span
                          key={index}
                          className="badge bg-light text-dark border d-flex align-items-center gap-2 px-2.5 py-2 rounded-3 fw-normal"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {formatDateLabel(dateArray)}
                          <button
                            type="button"
                            className="btn-close shadow-none"
                            style={{
                              width: "0.5em",
                              height: "0.5em",
                              fontSize: "0.65rem",
                            }}
                            onClick={() => handleRemoveRange(dateArray)}
                            disabled={loading}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
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
