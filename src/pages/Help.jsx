import React from "react";

const Help = () => {
  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2">The Fast Minds Club</h1>
        <p className="text-muted fs-5">
          Built for variable energy days. You set the rules.
        </p>
        <hr className="my-4" />
      </div>

      <div className="p-4 rounded-4 bg-light border-0 shadow-sm mb-5 text-center">
        <h3 className="fw-bold mb-2">Everything is Customisable</h3>
        <p className="mb-0 text-secondary">
          There is no "wrong" way to use this system. Scale it up when you have
          hyperfocus, or strip it down to absolute basics when you are
          overwhelmed.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="fs-3">🌱</span>
              <h4 className="fw-bold mb-0 text-success">Keep It Simple</h4>
            </div>
            <p className="text-muted small">
              Perfect for low-maintenance tracking or heavy brain-fog days:
            </p>
            <ul className="ps-3 mb-0 small text-secondary">
              <li className="mb-2">
                Just quick-add tasks without dates or categories.
              </li>
              <li className="mb-2">
                Ignore point values entirely if they cause friction.
              </li>
              <li className="mb-2">
                Treat it like a digital scratchpad to empty your head.
              </li>
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="fs-3">⚙️</span>
              <h4 className="fw-bold mb-0 text-primary">Make It Advanced</h4>
            </div>
            <p className="text-muted small">
              Deepen your setup to protect your daily capacity:
            </p>
            <ul className="ps-3 mb-0 small text-secondary">
              <li className="mb-2">
                Sync with Google Calendar to automatically pull real-world
                events.
              </li>
              <li className="mb-2">
                Assign energy point weights to custom category tags.
              </li>
              <li className="mb-2">
                Map keyword triggers to account for hidden emotional drains.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <h3 className="fw-bold mb-4">Core Mechanics</h3>
      <div className="d-flex flex-column gap-3 mb-5">
        <div className="p-3 bg-white border border-light shadow-sm rounded-3">
          <h5 className="fw-bold text-dark mb-1">⚡ Energy Points System</h5>
          <p className="small text-muted mb-0">
            Time management doesn't always work for ADHD; energy management
            does. Tasks and appointments consume limited capacity. When your
            daily budget is hit, the app signals that it's time to stop.
          </p>
        </div>

        <div className="p-3 bg-white border border-light shadow-sm rounded-3">
          <h5 className="fw-bold text-dark mb-1">
            🛑 Strictly Enforced Rest Days
          </h5>
          <p className="small text-muted mb-0">
            Prevent crash-and-burn cycles by scheduling guilt-free rest windows
            where task rollover limits relax, keeping you safe from executive
            burnout.
          </p>
        </div>

        <div className="p-3 bg-white border border-light shadow-sm rounded-3">
          <h5 className="fw-bold text-dark mb-1">📅 Adaptive Google Sync</h5>
          <p className="small text-muted mb-0">
            Quick-add items dynamically on the go, then choice-link them into
            your live Google calendar schedule later when you have the bandwidth
            to assign times.
          </p>
        </div>
      </div>

      <div className="text-center text-muted small mt-5">
        <p>
          Experiment with settings until they click. Your setup should work for
          you, not against you.
        </p>
      </div>
    </div>
  );
};

export default Help;
