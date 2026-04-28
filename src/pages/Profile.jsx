import { useState, useEffect } from "react";
import axios from "axios";
import EnergySlider from "../components/Energy/EnergySlider";
import EnergyToggle from "../components/Energy/EnergyToggle";

const Profile = () => {
  const [user, setUser] = useState(null);
  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseURL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [baseURL, token]);

  if (!user)
    return <div className="p-5 text-center text-muted">Loading...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: "1000px" }}>
      <header className="mb-5 border-bottom pb-4">
        <h2 className="fw-bold text-dark mb-1">Hello, {user.name}</h2>
        <p className="text-secondary mb-0">
          System Settings & Account Preferences
        </p>
      </header>

      <div className="row g-5">
        {/* Left Column: Functional Settings */}
        <div className="col-lg-7">
          <div className="mb-4">
            <h6 className="text-uppercase ls-wide fw-bold text-muted small mb-3">
              Workflow Configuration
            </h6>
            <div className="bg-white border rounded-3 p-4 mb-3 shadow-sm">
              <EnergyToggle
                showEnergyBar={user.settings?.showEnergyBar ?? true}
                onUpdate={(val) =>
                  setUser((prev) => ({
                    ...prev,
                    settings: { ...prev.settings, showEnergyBar: val },
                  }))
                }
              />
            </div>

            {(user.settings?.showEnergyBar ?? true) && (
              <div className="bg-white border rounded-3 p-4 shadow-sm">
                <label className="fw-bold small d-block mb-4 text-dark">
                  DAILY ENERGY CAPACITY
                </label>
                <EnergySlider
                  initialValue={user.dailyEnergyLimit}
                  onUpdate={(val) =>
                    setUser({ ...user, dailyEnergyLimit: val })
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Account Meta */}
        <div className="col-lg-5">
          <h6 className="text-uppercase ls-wide fw-bold text-muted small mb-3">
            Identity
          </h6>
          <div className="bg-light border rounded-3 p-4 shadow-sm">
            <div className="mb-4">
              <label className="text-muted small d-block mb-1">
                REGISTERED NAME
              </label>
              <div className="h6 fw-bold mb-0 text-dark">{user.name}</div>
            </div>
            <div>
              <label className="text-muted small d-block mb-1">
                EMAIL ADDRESS
              </label>
              <div className="h6 fw-bold mb-0 text-dark">{user.email}</div>
            </div>
            <hr className="my-4" />
            <button
              className="btn btn-outline-danger btn-sm rounded-pill px-4"
              disabled
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
