import HistoryComponent from "@/components/HistoryComponent";
import Navbar from "@/components/Navbar";
import Scheduler from "@/components/Scheduler";
import SettingsComponent from "@/components/SettingsComponent";
import SideBar from "@/components/SideBar";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OwnerDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "RESERVATION SCHEDULE" | "HISTORY" | "SETTINGS" | "LOGOUT"
  >("RESERVATION SCHEDULE");

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (
    view: "RESERVATION SCHEDULE" | "HISTORY" | "SETTINGS" | "LOGOUT"
  ) => {
    setActiveView(view);
  };

  const handleLogout = () => {
    setAuth(false);
    navigate("/login");

  };

  useEffect(() => {
    if (activeView === "LOGOUT") {
      handleLogout();
    }
  }, [activeView]);

  return (
    <div className="flex min-h-screen">
      <div className="w-[300px] bg-gray-50">
        <SideBar onNavigate={handleNavigation} />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar title={activeView} />

        <div className="flex-1 p-8">
          {activeView === "RESERVATION SCHEDULE" && (
            <>
              <div className="h-16 flex justify-center space-x-12">
                <div className="bg-red-200 p-4 w-48 flex justify-center items-center rounded-md">
                  Mon 05/12
                </div>
                <div className="bg-purple-300 p-4 w-48 flex justify-center items-center rounded-md">
                  Available Seats: 0
                </div>
                <div className="bg-blue-300 p-4 w-48 flex justify-center items-center rounded-md">
                  Create Reservation
                </div>
              </div>
              <div className="h-full">
                <Scheduler />
              </div>
            </>
          )}
          {activeView === "HISTORY" && <HistoryComponent />}
          {activeView === "SETTINGS" && <SettingsComponent />}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
