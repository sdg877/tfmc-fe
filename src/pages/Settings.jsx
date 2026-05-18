import React, { useState } from "react";
import EnergySlider from "../components/Energy/EnergySlider";
import EnergyToggle from "../components/Energy/EnergyToggle";
import GoogleConnect from "../components/Google/GoogleConnect";
import CategoryManager from "../components/Energy/CategoryManager";

const Settings = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState("energy");

  if (!user)
    return (
      <div className="container mt-5 text-center text-muted py-5">
        Loading...
      </div>
    );

  const showEnergyFeatures = user.settings?.showEnergyBar ?? true;

  const tabs = [
    { id: "energy", label: "Energy & Categories" },
    { id: "integrations", label: "Integrations" },
  ];

  const updateEnergyToggle = (val) => {
    setUser((prev) => ({
      ...prev,
      settings: { ...prev.settings, showEnergyBar: val },
    }));
  };

  return (
    <div className="container py-4" style={{ maxWidth: "1000px" }}>
      <header className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Settings</h2>
        <p className="text-muted small text-uppercase fw-bold ls-wide">
          Customise your experience{user?.name ? `, ${user.name}` : ""}
        </p>
      </header>

      <ul className="nav nav-pills nav-fill mb-4 bg-light p-1 rounded-pill shadow-sm border">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link rounded-pill fw-bold ${
                activeTab === tab.id ? "active bg-dark text-white" : "text-dark"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content mt-2">
        {activeTab === "energy" && (
          <div className="fade-in">
            <h6 className="text-uppercase fw-bold text-muted small mb-3 px-1">
              Energy Dashboard
            </h6>

            <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
              <EnergyToggle
                showEnergyBar={showEnergyFeatures}
                onUpdate={updateEnergyToggle}
              />
            </div>

            {showEnergyFeatures ? (
              <div className="fade-in">
                <h6 className="text-uppercase fw-bold text-muted small mt-4 mb-3 px-1">
                  Capacity & Workflow
                </h6>
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
                  <label className="fw-bold small d-block mb-4 text-dark text-uppercase ls-wide">
                    Daily Energy Capacity
                  </label>
                  <EnergySlider
                    initialValue={user.dailyEnergyLimit}
                    onUpdate={(val) =>
                      setUser((prev) => ({ ...prev, dailyEnergyLimit: val }))
                    }
                  />
                </div>

                <CategoryManager user={user} onUpdate={setUser} />
              </div>
            ) : (
              <div className="p-4 text-center border rounded-4 bg-light mt-3">
                <p className="text-muted small mb-0">
                  Enable the Energy Bar above to configure your daily limits and
                  categories.
                </p>
              </div>
            )}
          </div>
        )}

        {/* --- INTEGRATIONS TAB --- */}
        {activeTab === "integrations" && (
          <div className="fade-in">
            <h6 className="text-uppercase fw-bold text-muted small mb-3 px-1">
              Third-Party Sync
            </h6>
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-3 rounded-circle">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="fw-bold mb-0">Google Calendar</p>
                    <p className="small text-muted mb-0">
                      {user?.googleConnected
                        ? "Your appointments are synced."
                        : "View your external events alongside your tasks."}
                    </p>
                  </div>
                </div>
                <GoogleConnect
                  isConnected={user?.googleConnected}
                  onSyncSuccess={(updatedUser) => setUser(updatedUser)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
