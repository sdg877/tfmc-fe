// import React from "react";

// const Help = () => {
//   return (
//     <div className="container py-5" style={{ maxWidth: "800px" }}>
//       <div className="text-center mb-5">
//         <h1 className="fw-bold mb-2">The Fast Minds Club</h1>
//         <p className="text-muted fs-5">
//           Built for variable energy days. You set the rules.
//         </p>
//         <hr className="my-4" />
//       </div>

//       <div className="p-4 rounded-4 bg-light border-0 shadow-sm mb-5 text-center">
//         <h3 className="fw-bold mb-2">Everything is Customisable</h3>
//         <p className="mb-0 text-secondary">
//           There is no "wrong" way to use this system. Scale it up when you have
//           hyperfocus, or strip it down to absolute basics when you are
//           overwhelmed.
//         </p>
//       </div>

//       <div className="row g-4 mb-5">
//         <div className="col-md-6">
//           <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
//             <div className="d-flex align-items-center gap-2 mb-3">
//               <span className="fs-3">🌱</span>
//               <h4 className="fw-bold mb-0 text-success">Keep It Simple</h4>
//             </div>
//             <p className="text-muted small">
//               Perfect for low-maintenance tracking or heavy brain-fog days:
//             </p>
//             <ul className="ps-3 mb-0 small text-secondary">
//               <li className="mb-2">
//                 Just quick-add tasks without dates or categories.
//               </li>
//               <li className="mb-2">
//                 Ignore point values entirely if they cause friction.
//               </li>
//               <li className="mb-2">
//                 Treat it like a digital scratchpad to empty your head.
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="col-md-6">
//           <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
//             <div className="d-flex align-items-center gap-2 mb-3">
//               <span className="fs-3">⚙️</span>
//               <h4 className="fw-bold mb-0 text-primary">Make It Advanced</h4>
//             </div>
//             <p className="text-muted small">
//               Deepen your setup to protect your daily capacity:
//             </p>
//             <ul className="ps-3 mb-0 small text-secondary">
//               <li className="mb-2">
//                 Sync with Google Calendar to automatically pull real-world
//                 events.
//               </li>
//               <li className="mb-2">
//                 Assign energy point weights to custom category tags.
//               </li>
//               <li className="mb-2">
//                 Map keyword triggers to account for hidden emotional drains.
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       <h3 className="fw-bold mb-4">Core Mechanics</h3>
//       <div className="d-flex flex-column gap-3 mb-5">
//         <div className="p-3 bg-white border border-light shadow-sm rounded-3">
//           <h5 className="fw-bold text-dark mb-1">⚡ Energy Points System</h5>
//           <p className="small text-muted mb-0">
//             Time management doesn't always work for ADHD; energy management
//             does. Tasks and appointments consume limited capacity. When your
//             daily budget is hit, the app signals that it's time to stop.
//           </p>
//         </div>

//         <div className="p-3 bg-white border border-light shadow-sm rounded-3">
//           <h5 className="fw-bold text-dark mb-1">
//             🛑 Strictly Enforced Rest Days
//           </h5>
//           <p className="small text-muted mb-0">
//             Prevent crash-and-burn cycles by scheduling guilt-free rest windows
//             where task rollover limits relax, keeping you safe from executive
//             burnout.
//           </p>
//         </div>

//         <div className="p-3 bg-white border border-light shadow-sm rounded-3">
//           <h5 className="fw-bold text-dark mb-1">📅 Adaptive Google Sync</h5>
//           <p className="small text-muted mb-0">
//             Quick-add items dynamically on the go, then choice-link them into
//             your live Google calendar schedule later when you have the bandwidth
//             to assign times.
//           </p>
//         </div>
//       </div>

//       <div className="text-center text-muted small mt-5">
//         <p>
//           Experiment with settings until they click. Your setup should work for
//           you, not against you.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Help;

import React from "react";

const Help = () => {
  return (
    <div style={{ backgroundColor: "#faf9f7", paddingBottom: "5rem" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #f3e5f5 0%, #e3f2fd 60%, #e8f5e9 100%)",
        padding: "1.5rem 1.25rem 3rem",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "#b0b0b0", marginBottom: "0.15rem" }}>
          How it works
        </p>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.5px", marginBottom: "0.1rem" }}>
          Your guide
        </h1>
        <p style={{ color: "#aaa", fontSize: "0.78rem", margin: 0 }}>
          Built for variable energy days. You set the rules.
        </p>
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 1rem" }}>

        {/* Intro card */}
        <div style={{
          background: "linear-gradient(135deg, #f3e5f5, #e8f5e9)",
          borderRadius: "20px", padding: "1.25rem",
          marginTop: "-1.5rem", marginBottom: "0.75rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}>
          <p style={{ fontWeight: 800, fontSize: "1rem", color: "#1a1a2e", marginBottom: "0.35rem" }}>
            Everything is customisable
          </p>
          <p style={{ color: "#666", fontSize: "0.82rem", lineHeight: 1.6, margin: 0 }}>
            There's no wrong way to use this. Scale it up when you have hyperfocus, or strip it back to basics when you're overwhelmed.
          </p>
        </div>

        {/* Simple vs Advanced */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.75rem" }}>
          <div style={{
            backgroundColor: "white", borderRadius: "16px", padding: "1.1rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0",
          }}>
            <p style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>🌱</p>
            <p style={{ fontWeight: 800, color: "#2e7d32", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Keep it simple</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {[
                "Quick-add tasks without dates or categories",
                "Ignore point values if they cause friction",
                "Use it as a digital brain dump",
              ].map((item) => (
                <p key={item} style={{ fontSize: "0.75rem", color: "#888", lineHeight: 1.4, margin: 0, paddingLeft: "0.75rem", borderLeft: "2px solid #e8f5e9" }}>
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: "white", borderRadius: "16px", padding: "1.1rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0",
          }}>
            <p style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>⚙️</p>
            <p style={{ fontWeight: 800, color: "#1565c0", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Make it advanced</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {[
                "Sync Google Calendar or iCal feeds",
                "Set custom energy weights per category",
                "Map keywords to emotional drains",
              ].map((item) => (
                <p key={item} style={{ fontSize: "0.75rem", color: "#888", lineHeight: 1.4, margin: 0, paddingLeft: "0.75rem", borderLeft: "2px solid #e3f2fd" }}>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Core mechanics */}
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#bbb", marginBottom: "0.6rem", paddingLeft: "0.25rem" }}>
          Core mechanics
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
          {[
            {
              emoji: "⚡",
              title: "Energy Points System",
              desc: "Time management doesn't always work for ADHD — energy management does. Tasks and appointments consume limited capacity. When your daily budget is hit, the app signals it's time to stop.",
              color: "#fff3e0",
              border: "#ffcc80",
            },
            {
              emoji: "🛑",
              title: "Strictly Enforced Rest Days",
              desc: "Prevent crash-and-burn cycles by scheduling guilt-free rest windows where task rollover limits relax, keeping you safe from executive burnout.",
              color: "#fce4ec",
              border: "#f48fb1",
            },
            {
              emoji: "📅",
              title: "Adaptive Calendar Sync",
              desc: "Quick-add items on the go, then link them into your live calendar schedule when you have the bandwidth to assign times.",
              color: "#e3f2fd",
              border: "#90caf9",
            },
            {
              emoji: "⭐",
              title: "Star to Plan",
              desc: "Star any task to pull it into today's list. It counts toward your energy total for the day so you always know what you're actually committing to.",
              color: "#f3e5f5",
              border: "#ce93d8",
            },
          ].map(({ emoji, title, desc, color, border }) => (
            <div key={title} style={{
              backgroundColor: "white", borderRadius: "16px",
              padding: "1rem 1.1rem",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0",
              display: "flex", gap: "0.85rem", alignItems: "flex-start",
            }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "12px", flexShrink: 0,
                backgroundColor: color, border: `1.5px solid ${border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem",
              }}>
                {emoji}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.85rem", marginBottom: "0.2rem" }}>{title}</p>
                <p style={{ color: "#aaa", fontSize: "0.78rem", lineHeight: 1.5, margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", color: "#ccc", fontSize: "0.75rem", lineHeight: 1.6 }}>
          Experiment with settings until they click. Your setup should work for you, not against you.
        </p>

      </div>
    </div>
  );
};

export default Help;