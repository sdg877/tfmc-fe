import React, { useState } from 'react';

const EventKeywords = () => {
  // 1. Manage the keyword mappings (mocking user.calendarMapping from the DB)
  const [mappings, setMappings] = useState([
    { keyword: 'meeting', points: 20 },
    { keyword: 'doctor', points: 40 },
    { keyword: 'call', points: 10 },
  ]);

  // Form states
  const [newKeyword, setNewKeyword] = useState('');
  const [newPoints, setNewPoints] = useState(10);

  // 2. Dummy list of Google Events to test our keyword filtering locally
  const dummyEvents = [
    { id: '1', summary: 'Quick sync call with team', start: '10:00' },
    { id: '2', summary: 'Doctor checkup appointment', start: '11:30' },
    { id: '3', summary: 'Weekly project alignment meeting', start: '14:00' },
    { id: '4', summary: 'Review code documentation', start: '16:00' }, // No match, should fall back to default cost
  ];

  // Handle adding a new mapping rule
  const handleAddMapping = (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    setMappings([...mappings, { keyword: newKeyword.trim().toLowerCase(), points: Number(newPoints) }]);
    setNewKeyword('');
    setNewPoints(10);
  };

  // Handle deleting a mapping rule
  const handleDeleteMapping = (index) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  // Helper function mimicking your backend logic to calculate energy cost per event
  const calculateEventCost = (summary) => {
    const title = (summary || '').toLowerCase();
    const match = mappings.find((m) => title.includes(m.keyword.toLowerCase()));
    return match ? match.points : 5; // 5 is the default fallback cost in your backend
  };

  // Calculate the grand total of energy usage for all events today
  const totalEnergyDrain = dummyEvents.reduce((sum, event) => sum + calculateEventCost(event.summary), 0);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
        Google Calendar Keyword Energy Accountant
      </h2>

      {/* Grid Layout for Configuration vs Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
        
        {/* Left Column: Manage Rules */}
        <div>
          <h3>1. Keyword Points Mapping</h3>
          
          <form onSubmit={handleAddMapping} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g., dentist, review"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              style={{ padding: '0.5rem', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="number"
              min="0"
              max="100"
              value={newPoints}
              onChange={(e) => setNewPoints(e.target.value)}
              style={{ padding: '0.5rem', width: '70px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Add
            </button>
          </form>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {mappings.map((m, index) => (
              <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f9f9f9', marginBottom: '0.5rem', borderRadius: '4px', alignItems: 'center' }}>
                <span><strong>"{m.keyword}"</strong> ➔ {m.points} Energy Points</span>
                <button 
                  onClick={() => handleDeleteMapping(index)}
                  style={{ background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Live Simulator Output */}
        <div>
          <div style={{ background: '#f0f7ff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #d0e6ff' }}>
            <h4 style={{ margin: 0, color: '#004085' }}>Total Calculated Day Drain</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: '#004085' }}>
              {totalEnergyDrain} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>Points</span>
            </p>
          </div>

          <h3>2. Live Calendar Event Scan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {dummyEvents.map((event) => {
              const exactCost = calculateEventCost(event.summary);
              const hasCustomMatch = exactCost !== 5; // Visual hint if a rule applied

              return (
                <div 
                  key={event.id} 
                  style={{ 
                    padding: '0.75rem', 
                    borderRadius: '6px', 
                    border: '1px solid #eee', 
                    background: hasCustomMatch ? '#fffdf0' : '#fff',
                    borderColor: hasCustomMatch ? '#ffeeba' : '#eee',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}
                >
                  <div>
                    <small style={{ color: '#666', display: 'block' }}>{event.start}</small>
                    <span style={{ fontSize: '0.95rem' }}>{event.summary}</span>
                  </div>
                  <span style={{ 
                    padding: '0.25rem 0.6rem', 
                    borderRadius: '12px', 
                    fontSize: '0.85rem', 
                    fontWeight: 'bold',
                    background: hasCustomMatch ? '#ffc107' : '#e2e3e5',
                    color: hasCustomMatch ? '#000' : '#383d41'
                  }}>
                    {exactCost} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventKeywords;