import { useEffect, useState } from "react";
import axios from "axios";
import HeatMapGrid from "../components/HeatMap/HeatMapGrid";

const Progress = () => {
  const [heatmapData, setHeatmapData] = useState({});
  const [joinDate, setJoinDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resTasks, resUser] = await Promise.all([
          axios.get(`${baseURL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setJoinDate(resUser.data.createdAt);

        const weights = {
          quickwin: 5,
          admin: 10,
          physical: 20,
          social: 30,
          focus: 40,
          stress: 45,
        };
        const dayStats = {};

        resTasks.data.forEach((task) => {
          if (task.isCompleted && task.updatedAt) {
            const date = new Date(task.updatedAt).toISOString().split("T")[0];
            const energy = weights[task.category] || 10;

            if (!dayStats[date]) {
              dayStats[date] = { totalEnergy: 0, count: 0 };
            }
            dayStats[date].totalEnergy += energy;
            dayStats[date].count += 1;
          }
        });

        const finalizedMap = {};
        Object.keys(dayStats).forEach((date) => {
          const { totalEnergy, count } = dayStats[date];
          let level = 1;
          if (totalEnergy > 90) level = 4;
          else if (totalEnergy > 60) level = 3;
          else if (totalEnergy > 30) level = 2;

          finalizedMap[date] = { level, count };
        });

        setHeatmapData(finalizedMap);
      } catch (err) {
        console.error("Heatmap fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [baseURL, token]);

  if (loading)
    return (
      <div className="container py-5 text-center text-muted">
        Loading your progress...
      </div>
    );

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      <header className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Your Progress</h2>
        <p className="text-muted small text-uppercase fw-bold ls-wide">
          Visualise your journey
        </p>
      </header>

      <HeatMapGrid data={heatmapData} joinDate={joinDate} />

      <div className="mt-4 p-3 bg-white rounded-4 border shadow-sm text-center">
        <p className="small text-muted mb-0">
          Squares appear as you stay with the club. Hover to see your daily
          wins!
        </p>
      </div>
    </div>
  );
};

export default Progress;
