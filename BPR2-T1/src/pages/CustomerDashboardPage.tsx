import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDecodedToken, getUserByEmail } from "@/api/authAPI";
import HistoryComponent from "@/components/HistoryComponent";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { useAuth } from "@/context/AuthContext";
import { removeToken } from "@/services/jwtService";

type Props = {};

const CustomerDashboardPage: React.FC<Props> = () => {
  const [activeView, setActiveView] = useState<
    "RESERVATION SCHEDULE" | "HISTORY" | "SETTINGS" | "LOGOUT"
  >("HISTORY");

  const [activeRestaurant, setActiveRestaurant] = useState<any>(null);
  const [userDetails ,setUserDetails] = useState<any>(null);

  const { setAuth, user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== "Customer") {
    return null;
  }

  useEffect(() => {
    if (user?.role !== "Customer") {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

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

  const handleLogout = () => {
    removeToken();
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
        <SideBar onNavigate={setActiveView} role="RestaurantOwner" />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar title={activeView} />

        <div className="flex-1 p-8">
          {activeView === "RESERVATION SCHEDULE" && <div>ficko</div>}
          {activeView === "HISTORY" &&
            activeRestaurant && ( 
              <HistoryComponent restaurantId={activeRestaurant.id} />
            )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
