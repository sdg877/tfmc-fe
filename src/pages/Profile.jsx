import { useState, useEffect } from "react";
import axios from "axios";
import EnergySlider from "../components/Energy/EnergySlider";

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
  }, []);

  if (!user) return <div className="p-5 text-center">Loading Profile...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="fw-bold mb-4">Settings</h2>

      <section className="mb-4">
        <h5 className="text-muted small fw-bold text-uppercase">
          Health & Energy
        </h5>
        <EnergySlider
          initialValue={user.dailyEnergyLimit}
          onUpdate={(val) => setUser({ ...user, dailyEnergyLimit: val })}
        />
      </section>

      <section className="card p-3 border-0 shadow-sm">
        <h5 className="text-muted small fw-bold text-uppercase">Account</h5>
        <p className="mb-1">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="mb-0">
          <strong>Email:</strong> {user.email}
        </p>
      </section>
    </div>
  );
};

export default Profile;
