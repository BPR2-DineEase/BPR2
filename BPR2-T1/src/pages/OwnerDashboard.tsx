import { getDecodedToken, getUserByEmail } from "@/api/authAPI";
import HistoryComponent from "@/components/HistoryComponent";
import Navbar from "@/components/Navbar";
import Scheduler from "@/components/Scheduler";
import SettingsComponent from "@/components/SettingsComponent";
import SideBar from "@/components/SideBar";
import { useAuth } from "@/context/AuthContext";
import { removeToken } from "@/services/jwtService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OwnerDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "RESERVATION SCHEDULE" | "HISTORY" | "SETTINGS" | "LOGOUT"
  >("RESERVATION SCHEDULE");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [activeRestaurant, setActiveRestaurant] = useState<any>(null);

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    setAuth(false);
    navigate("/login");
  };

  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      handleLogout();
      return;
    }

    const decodedToken = getDecodedToken(token);
    const email =
      decodedToken?.[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ];

    if (!email) {
      handleLogout();
      return;
    }

    try {
      const user = await getUserByEmail(email);
      console.log("Fetched User Details:", user);
      setUserDetails(user);
      setActiveRestaurant(user.restaurant);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      handleLogout();
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    if (activeView === "LOGOUT") {
      handleLogout();
    }
  }, [activeView]);

  if (!userDetails || !activeRestaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-[300px] bg-gray-50">
        <SideBar onNavigate={setActiveView} />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar title={activeView} />

        <div className="flex-1 p-8">
          {activeView === "RESERVATION SCHEDULE" && <Scheduler />}
          {activeView === "HISTORY" && (
            <HistoryComponent restaurantId={activeRestaurant.id} />
          )}
          {activeView === "SETTINGS" && <SettingsComponent />}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
