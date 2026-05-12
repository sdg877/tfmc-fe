// import React from "react";
// import EnergySlider from "../components/Energy/EnergySlider";
// import EnergyToggle from "../components/Energy/EnergyToggle";
// import GoogleConnect from "../components/Auth/GoogleConnect";
// import CategoryManager from "../components/Energy/CategoryManager";

// const Settings = ({ user, setUser }) => {
//   if (!user) return <div className="p-5 text-center">Loading...</div>;

//   return (
//     <div className="container py-4" style={{ maxWidth: "900px" }}>
//       <h2 className="fw-bold mb-4">Settings</h2>

//       <section className="mb-5">
//         <h6 className="text-uppercase fw-bold text-muted small mb-3">
//           Workflow Configuration
//         </h6>
//         <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
//           <EnergyToggle
//             showEnergyBar={user.settings?.showEnergyBar ?? true}
//             onUpdate={(val) =>
//               setUser((prev) => ({
//                 ...prev,
//                 settings: { ...prev.settings, showEnergyBar: val },
//               }))
//             }
//           />
//         </div>

//         {(user.settings?.showEnergyBar ?? true) && (
//           <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
//             <label className="fw-bold small d-block mb-4 text-dark text-uppercase">
//               Daily Energy Capacity
//             </label>
//             <EnergySlider
//               initialValue={user.dailyEnergyLimit}
//               onUpdate={(val) => setUser({ ...user, dailyEnergyLimit: val })}
//             />
//           </div>
//         )}
//       </section>

//         {(user.settings?.showEnergyBar ?? true) && (
//           <>
//             <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
//               <label className="fw-bold small d-block mb-4 text-dark text-uppercase">
//                 Daily Energy Capacity
//               </label>
//               <EnergySlider
//                 initialValue={user.dailyEnergyLimit}
//                 onUpdate={(val) => setUser({ ...user, dailyEnergyLimit: val })}
//               />
//             </div>

//             {/* Added the Manager here */}
//             <CategoryManager user={user} onUpdate={setUser} />
//           </>
//         )}

//       <section>
//         <h6 className="text-uppercase fw-bold text-muted small mb-3">
//           Integrations
//         </h6>
//         <div className="card border-0 shadow-sm rounded-4 p-4">
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <p className="fw-bold mb-0">Google Calendar</p>
//               <p className="small text-muted mb-0">
//                 {user?.googleConnected
//                   ? "Your appointments are synced."
//                   : "View your external events alongside your tasks."}
//               </p>
//             </div>
//             <GoogleConnect
//               isConnected={user?.googleConnected}
//               onSyncSuccess={(updatedUser) => setUser(updatedUser)}
//             />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Settings;

import React from "react";
import EnergySlider from "../components/Energy/EnergySlider";
import EnergyToggle from "../components/Energy/EnergyToggle";
import GoogleConnect from "../components/Auth/GoogleConnect";
import CategoryManager from "../components/Energy/CategoryManager";

const Settings = ({ user, setUser }) => {
  if (!user) return <div className="p-5 text-center">Loading...</div>;

  return (
    <div className="container py-4" style={{ maxWidth: "900px" }}>
      <h2 className="fw-bold mb-4">Settings</h2>

      <section className="mb-5">
        <h6 className="text-uppercase fw-bold text-muted small mb-3">Workflow Configuration</h6>
        
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
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
          <>
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
              <label className="fw-bold small d-block mb-4 text-dark text-uppercase">
                Daily Energy Capacity
              </label>
              <EnergySlider
                initialValue={user.dailyEnergyLimit}
                onUpdate={(val) => setUser((prev) => ({ ...prev, dailyEnergyLimit: val }))}
              />
            </div>

            <CategoryManager user={user} onUpdate={setUser} />
          </>
        )}
      </section>

      <section>
        <h6 className="text-uppercase fw-bold text-muted small mb-3">Integrations</h6>
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="fw-bold mb-0">Google Calendar</p>
              <p className="small text-muted mb-0">
                {user?.googleConnected ? "Your appointments are synced." : "View your external events alongside your tasks."}
              </p>
            </div>
            <GoogleConnect
              isConnected={user?.googleConnected}
              onSyncSuccess={(updatedUser) => setUser(updatedUser)}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;