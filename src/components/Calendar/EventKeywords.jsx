// import React, { useState } from 'react';

// const EventKeywords = () => {
//   // 1. Manage the keyword mappings (mocking user.calendarMapping from the DB)
//   const [mappings, setMappings] = useState([
//     { keyword: 'meeting', points: 20 },
//     { keyword: 'doctor', points: 40 },
//     { keyword: 'call', points: 10 },
//   ]);

//   // Form states
//   const [newKeyword, setNewKeyword] = useState('');
//   const [newPoints, setNewPoints] = useState(10);

//   // 2. Dummy list of Google Events to test our keyword filtering locally
//   const dummyEvents = [
//     { id: '1', summary: 'Quick sync call with team', start: '10:00' },
//     { id: '2', summary: 'Doctor checkup appointment', start: '11:30' },
//     { id: '3', summary: 'Weekly project alignment meeting', start: '14:00' },
//     { id: '4', summary: 'Review code documentation', start: '16:00' }, // No match, should fall back to default cost
//   ];

//   // Handle adding a new mapping rule
//   const handleAddMapping = (e) => {
//     e.preventDefault();
//     if (!newKeyword.trim()) return;

//     setMappings([...mappings, { keyword: newKeyword.trim().toLowerCase(), points: Number(newPoints) }]);
//     setNewKeyword('');
//     setNewPoints(10);
//   };

//   // Handle deleting a mapping rule
//   const handleDeleteMapping = (index) => {
//     setMappings(mappings.filter((_, i) => i !== index));
//   };

//   // Helper function mimicking your backend logic to calculate energy cost per event
//   const calculateEventCost = (summary) => {
//     const title = (summary || '').toLowerCase();
//     const match = mappings.find((m) => title.includes(m.keyword.toLowerCase()));
//     return match ? match.points : 5; // 5 is the default fallback cost in your backend
//   };

//   // Calculate the grand total of energy usage for all events today
//   const totalEnergyDrain = dummyEvents.reduce((sum, event) => sum + calculateEventCost(event.summary), 0);

//   return (
//     <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
//       <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
//         Google Calendar Keyword Energy Accountant
//       </h2>

//       {/* Grid Layout for Configuration vs Preview */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
        
//         {/* Left Column: Manage Rules */}
//         <div>
//           <h3>1. Keyword Points Mapping</h3>
          
//           <form onSubmit={handleAddMapping} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
//             <input
//               type="text"
//               placeholder="e.g., dentist, review"
//               value={newKeyword}
//               onChange={(e) => setNewKeyword(e.target.value)}
//               style={{ padding: '0.5rem', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
//             />
//             <input
//               type="number"
//               min="0"
//               max="100"
//               value={newPoints}
//               onChange={(e) => setNewPoints(e.target.value)}
//               style={{ padding: '0.5rem', width: '70px', borderRadius: '4px', border: '1px solid #ccc' }}
//             />
//             <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
//               Add
//             </button>
//           </form>

//           <ul style={{ listStyle: 'none', padding: 0 }}>
//             {mappings.map((m, index) => (
//               <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f9f9f9', marginBottom: '0.5rem', borderRadius: '4px', alignItems: 'center' }}>
//                 <span><strong>"{m.keyword}"</strong> ➔ {m.points} Energy Points</span>
//                 <button 
//                   onClick={() => handleDeleteMapping(index)}
//                   style={{ background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Right Column: Live Simulator Output */}
//         <div>
//           <div style={{ background: '#f0f7ff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #d0e6ff' }}>
//             <h4 style={{ margin: 0, color: '#004085' }}>Total Calculated Day Drain</h4>
//             <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: '#004085' }}>
//               {totalEnergyDrain} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>Points</span>
//             </p>
//           </div>

//           <h3>2. Live Calendar Event Scan</h3>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
//             {dummyEvents.map((event) => {
//               const exactCost = calculateEventCost(event.summary);
//               const hasCustomMatch = exactCost !== 5; // Visual hint if a rule applied

//               return (
//                 <div 
//                   key={event.id} 
//                   style={{ 
//                     padding: '0.75rem', 
//                     borderRadius: '6px', 
//                     border: '1px solid #eee', 
//                     background: hasCustomMatch ? '#fffdf0' : '#fff',
//                     borderColor: hasCustomMatch ? '#ffeeba' : '#eee',
//                     display: 'flex', 
//                     justifyContent: 'space-between', 
//                     alignItems: 'center' 
//                   }}
//                 >
//                   <div>
//                     <small style={{ color: '#666', display: 'block' }}>{event.start}</small>
//                     <span style={{ fontSize: '0.95rem' }}>{event.summary}</span>
//                   </div>
//                   <span style={{ 
//                     padding: '0.25rem 0.6rem', 
//                     borderRadius: '12px', 
//                     fontSize: '0.85rem', 
//                     fontWeight: 'bold',
//                     background: hasCustomMatch ? '#ffc107' : '#e2e3e5',
//                     color: hasCustomMatch ? '#000' : '#383d41'
//                   }}>
//                     {exactCost} pts
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default EventKeywords;

import React, { useState, useEffect } from "react";
import axios from "axios";

const EventKeywords = ({ user, onUserUpdate }) => {
  // Use mappings from user context if available, otherwise default to empty array
  const [mappings, setMappings] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newPoints, setNewPoints] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Sync state with the logged-in user profile data
  useEffect(() => {
    if (user?.calendarMapping) {
      setMappings(user.calendarMapping);
    }
  }, [user]);

  // Helper function to send updated array to backend API
  const saveMappingsToDatabase = async (updatedMappings) => {
    setLoading(true);
    setError("");
    try {
      // Sending payload directly to your user configuration update endpoint
      const res = await axios.put(
        `${baseURL}/users/profile`, 
        { calendarMapping: updatedMappings },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Notify parent component to update globally stored user context state
      if (onUserUpdate) {
        onUserUpdate(res.data);
      } else {
        setMappings(res.data.calendarMapping || updatedMappings);
      }
    } catch (err) {
      console.error("Failed to sync calendar keywords:", err);
      setError("Could not save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = async (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    const cleanerKeyword = newKeyword.trim().toLowerCase();
    
    // Prevent duplicate keywords
    if (mappings.some(m => m.keyword.toLowerCase() === cleanerKeyword)) {
      setError("This keyword rule already exists.");
      return;
    }

    const updated = [...mappings, { keyword: cleanerKeyword, points: Number(newPoints) }];
    
    // Optimistic UI updates, followed by network sync
    setMappings(updated);
    setNewKeyword("");
    setNewPoints(10);
    await saveMappingsToDatabase(updated);
  };

  const handleRemoveKeyword = async (indexToRemove) => {
    const updated = mappings.filter((_, index) => index !== indexToRemove);
    setMappings(updated);
    await saveMappingsToDatabase(updated);
  };

  const handleUpdateWeight = async (indexToUpdate, newWeightValue) => {
    const updated = mappings.map((item, index) => {
      if (index === indexToUpdate) {
        return { ...item, points: Number(newWeightValue) };
      }
      return item;
    });
    setMappings(updated);
    await saveMappingsToDatabase(updated);
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 className="fw-bold mb-1">📅 Google Calendar Smart Drain</h4>
          <p className="text-muted small mb-0">Assign automatic energy points using event text keywords</p>
        </div>
        {loading && <span className="spinner-border spinner-border-sm text-secondary" role="status" />}
      </div>

      {error && <div className="alert alert-danger py-2 small border-0 rounded-3 mb-3">{error}</div>}

      {/* Input Form Setup */}
      <form onSubmit={handleAddKeyword} className="row g-2 mb-4">
        <div className="col-7">
          <input
            type="text"
            className="form-control form-control-sm bg-light border-0 shadow-none"
            placeholder="Keyword (e.g. clinic, review)"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-3">
          <select
            className="form-select form-select-sm bg-light border-0 shadow-none fw-bold text-dark"
            value={newPoints}
            onChange={(e) => setNewPoints(Number(e.target.value))}
            disabled={loading}
          >
            <option value="5">5 pts</option>
            <option value="10">10 pts</option>
            <option value="20">20 pts</option>
            <option value="30">30 pts</option>
            <option value="40">40 pts</option>
            <option value="50">50 pts</option>
          </select>
        </div>
        <div className="col-2">
          <button type="submit" className="btn btn-dark btn-sm w-100 fw-bold rounded-3" disabled={loading}>
            Add
          </button>
        </div>
      </form>

      {/* Rules Active Listing */}
      <div className="d-flex flex-column gap-2">
        {mappings.length === 0 ? (
          <p className="text-muted small text-center my-3 italic">
            No rules set. Default fallback cost is 5 points per event.
          </p>
        ) : (
          mappings.map((item, index) => (
            <div 
              key={index} 
              className="d-flex align-items-center justify-content-between bg-light p-2 rounded-3"
            >
              <div className="d-flex align-items-center gap-2 flex-grow-1">
                <span className="badge bg-white text-dark border small text-lowercase py-1 px-2 fw-semibold">
                  "{item.keyword}"
                </span>
                <span className="text-muted small">costs</span>
              </div>

              {/* Live select mapping update loop */}
              <div className="d-flex align-items-center gap-2">
                <select
                  className="form-select form-select-sm bg-white border border-light shadow-none py-0 px-2 fw-bold text-dark text-center"
                  style={{ width: "80px", height: "30px" }}
                  value={item.points}
                  onChange={(e) => handleUpdateWeight(index, e.target.value)}
                  disabled={loading}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                </select>
                
                <button
                  type="button"
                  className="btn btn-link link-danger p-1 text-decoration-none"
                  onClick={() => handleRemoveKeyword(index)}
                  disabled={loading}
                  aria-label="Remove keyword mapping rule"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventKeywords;