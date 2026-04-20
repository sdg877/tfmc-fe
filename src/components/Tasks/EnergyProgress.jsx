const EnergyProgress = ({ tasks, dailyLimit }) => {
  // 1. Sum up energy from all tasks in your list
  const totalUsed = tasks.reduce((acc, task) => acc + (task.energyRequired || 0), 0);
  
  // 2. Calculate percentage (and prevent division by zero if limit hasn't loaded)
  const limit = dailyLimit || 100; 
  const percentage = Math.min((totalUsed / limit) * 100, 100);
  
  // 3. Logic for bar colour based on "stress" levels
  const getBarColor = () => {
    if (percentage >= 100) return 'bg-danger';  // Maxed out
    if (percentage > 75) return 'bg-warning';   // Caution
    return 'bg-success';                        // Good to go
  };

  return (
    <div className="card p-3 mb-4 shadow-sm border-0 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0 fw-bold">Daily Energy Capacity</h6>
        <span className="badge bg-dark">
          {totalUsed} / {limit} Units
        </span>
      </div>
      
      <div className="progress" style={{ height: '25px', borderRadius: '10px' }}>
        <div 
          className={`progress-bar progress-bar-striped progress-bar-animated transition-all ${getBarColor()}`} 
          role="progressbar" 
          style={{ 
            width: `${percentage}%`,
            transition: 'width 0.5s ease-in-out' 
          }}
        >
          {percentage > 10 && `${Math.round(percentage)}%`}
        </div>
      </div>

      {totalUsed > limit && (
        <div className="mt-2 text-danger small fw-bold text-center">
          ⚠️ Warning: You've exceeded your set energy capacity.
        </div>
      )}
    </div>
  );
};

export default EnergyProgress;