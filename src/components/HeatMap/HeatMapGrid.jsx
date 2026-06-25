// import React, { useState } from "react";

// const HeatMapGrid = ({ data, joinDate, daysToView = 28 }) => {
//   const [hoveredDay, setHoveredDay] = useState(null);

//   const formatInternal = (d) => d.toLocaleDateString("sv-SE");
//   const formatDisplay = (d) => d.toLocaleDateString("en-GB");

//   const getLevelColor = (level, isBeforeJoining, isOverloaded) => {
//     if (isBeforeJoining) return "#f1f3f5";
//     if (isOverloaded) return "#FF007F";

//     switch (level) {
//       case 4:
//         return "#DB2777";
//       case 3:
//         return "#F472B6";
//       case 2:
//         return "#FBCFE8";
//       case 1:
//         return "#FCE7F3";
//       default:
//         return "#F5F5F7";
//     }
//   };

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const pureJoinDate = joinDate ? new Date(joinDate) : null;
//   const joinDateComparison = pureJoinDate
//     ? new Date(pureJoinDate.getTime()).setHours(0, 0, 0, 0)
//     : null;
//   const joinDateKey = pureJoinDate ? formatInternal(pureJoinDate) : null;

//   const days = Array.from({ length: daysToView }, (_, i) => {
//     const d = new Date();
//     d.setHours(0, 0, 0, 0);
//     d.setDate(today.getDate() - (daysToView - 1 - i));
//     return {
//       key: formatInternal(d),
//       display: formatDisplay(d),
//       dateObj: d,
//     };
//   });

//   return (
//     <div className="w-100 d-flex flex-column align-items-center py-2">
//       <div className="text-center mb-4">
//         <h5 className="fw-bold text-dark mb-1">Your Wins</h5>
//         <p className="text-muted small">Last 4 weeks</p>
//       </div>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(7, 1fr)",
//           gap: "12px",
//           width: "100%",
//           maxWidth: "500px",
//         }}
//         onMouseLeave={() => setHoveredDay(null)}
//       >
//         {days.map((day) => {
//           const dayInfo =
//             data && data[day.key]
//               ? data[day.key]
//               : { level: 0, count: 0, energyUsed: 0, dailyLimit: 100 };

//           const isJoinDate = joinDateKey && day.key === joinDateKey;
//           const isBeforeJoining =
//             joinDateComparison && day.dateObj.getTime() < joinDateComparison;

//           const energyPercent =
//             dayInfo.dailyLimit > 0
//               ? Math.round((dayInfo.energyUsed / dayInfo.dailyLimit) * 100)
//               : 0;

//           const isOverloaded =
//             energyPercent >= 100 ||
//             dayInfo.isOverloaded ||
//             (dayInfo.energyUsed > 0 &&
//               dayInfo.energyUsed >= dayInfo.dailyLimit);

//           return (
//             <div
//               key={day.key}
//               onMouseEnter={() => {
//                 if (isBeforeJoining) return;
//                 setHoveredDay({
//                   date: day.display,
//                   energyPercent,
//                   isOverloaded,
//                 });
//               }}
//               style={{
//                 aspectRatio: "1 / 1",
//                 backgroundColor: getLevelColor(
//                   dayInfo.level,
//                   isBeforeJoining,
//                   isOverloaded,
//                 ),
//                 borderRadius: "8px",
//                 border: isJoinDate
//                   ? "3px solid #1D4ED8"
//                   : isOverloaded
//                     ? "2px solid #FF0055"
//                     : "1px solid #E5E7EB",
//                 boxSizing: "border-box",
//                 cursor: isBeforeJoining ? "default" : "pointer",
//                 opacity: isBeforeJoining ? 0.4 : 1,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "1.1rem",
//                 transition: "transform 0.15s ease",
//               }}
//               className="heatmap-square shadow-sm"
//             >
//               {isOverloaded && !isBeforeJoining ? (
//                 <span
//                   style={{
//                     pointerEvents: "none",
//                     lineHeight: 1,
//                   }}
//                 >
//                   🔥
//                 </span>
//               ) : (
//                 ""
//               )}
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-4 text-center" style={{ minHeight: "24px" }}>
//         {hoveredDay ? (
//           <p className="text-dark fw-bold m-0">
//             {hoveredDay.date} — {hoveredDay.energyPercent}% energy used
//             {hoveredDay.isOverloaded && (
//               <span
//                 className="text-danger fw-bold ms-2"
//                 style={{ fontSize: "0.8rem" }}
//               >
//                 🔥 Overloaded
//               </span>
//             )}
//           </p>
//         ) : (
//           <p className="text-muted m-0">Consistency is key!</p>
//         )}
//       </div>

//       {pureJoinDate && (
//         <p className="text-muted small mt-3 pt-3 border-top w-75 text-center">
//           Joined: <strong>{formatDisplay(pureJoinDate)}</strong>
//         </p>
//       )}
//     </div>
//   );
// };

// export default HeatMapGrid;

import React, { useState } from "react";

const HeatMapGrid = ({ data, joinDate, user, daysToView = 28 }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  const formatInternal = (d) => d.toLocaleDateString("sv-SE");
  const formatDisplay = (d) => d.toLocaleDateString("en-GB");

  const getLevelColor = (level, isBeforeJoining, isOverloaded) => {
    if (isBeforeJoining) return "#f1f3f5";
    if (isOverloaded) return "#FF007F";

    switch (level) {
      case 4:
        return "#DB2777";
      case 3:
        return "#F472B6";
      case 2:
        return "#FBCFE8";
      case 1:
        return "#FCE7F3";
      default:
        return "#F5F5F7";
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pureJoinDate = joinDate ? new Date(joinDate) : null;
  const joinDateComparison = pureJoinDate
    ? new Date(pureJoinDate.getTime()).setHours(0, 0, 0, 0)
    : null;
  const joinDateKey = pureJoinDate ? formatInternal(pureJoinDate) : null;

  const days = Array.from({ length: daysToView }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(today.getDate() - (daysToView - 1 - i));
    return {
      key: formatInternal(d),
      display: formatDisplay(d),
      dateObj: d,
    };
  });

  return (
    <div className="w-100 d-flex flex-column align-items-center py-2">
      <div className="text-center mb-4">
        <h5 className="fw-bold text-dark mb-1">Your Wins</h5>
        <p className="text-muted small">Last 4 weeks</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "12px",
          width: "100%",
          maxWidth: "500px",
        }}
        onMouseLeave={() => setHoveredDay(null)}
      >
        {days.map((day) => {
          const dayInfo =
            data && data[day.key]
              ? data[day.key]
              : { level: 0, count: 0, energyUsed: 0, dailyLimit: 100 };

          const isJoinDate = joinDateKey && day.key === joinDateKey;
          const isBeforeJoining =
            joinDateComparison && day.dateObj.getTime() < joinDateComparison;

          const energyPercent =
            dayInfo.dailyLimit > 0
              ? Math.round((dayInfo.energyUsed / dayInfo.dailyLimit) * 100)
              : 0;

          // Check if this specific day is an active rest day/holiday
          const isRestDay = user?.holidays?.includes(day.key);

          // Overloaded if over 100% limit OR if it's a rest day and any energy was spent
          const isOverloaded =
            energyPercent >= 100 ||
            dayInfo.isOverloaded ||
            (dayInfo.energyUsed > 0 && dayInfo.energyUsed >= dayInfo.dailyLimit) ||
            (isRestDay && dayInfo.energyUsed > 0);

          return (
            <div
              key={day.key}
              onMouseEnter={() => {
                if (isBeforeJoining) return;
                setHoveredDay({
                  date: day.display,
                  energyPercent,
                  isOverloaded,
                });
              }}
              style={{
                aspectRatio: "1 / 1",
                backgroundColor: getLevelColor(
                  dayInfo.level,
                  isBeforeJoining,
                  isOverloaded,
                ),
                borderRadius: "8px",
                border: isJoinDate
                  ? "3px solid #1D4ED8"
                  : isOverloaded
                    ? "2px solid #FF0055"
                    : "1px solid #E5E7EB",
                boxSizing: "border-box",
                cursor: isBeforeJoining ? "default" : "pointer",
                opacity: isBeforeJoining ? 0.4 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.15s ease",
              }}
              className="heatmap-square shadow-sm"
            />
          );
        })}
      </div>

      <div className="mt-4 text-center" style={{ minHeight: "24px" }}>
        {hoveredDay ? (
          <p className="text-dark fw-bold m-0">
            {hoveredDay.date} — {hoveredDay.energyPercent}% energy used
            {hoveredDay.isOverloaded && (
              <span
                className="text-danger fw-bold ms-2"
                style={{ fontSize: "0.8rem" }}
              >
                Overloaded
              </span>
            )}
          </p>
        ) : (
          <p className="text-muted m-0">Consistency is key!</p>
        )}
      </div>

      {pureJoinDate && (
        <p className="text-muted small mt-3 pt-3 border-top w-75 text-center">
          Joined: <strong>{formatDisplay(pureJoinDate)}</strong>
        </p>
      )}
    </div>
  );
};

export default HeatMapGrid;