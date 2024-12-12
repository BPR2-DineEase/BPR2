import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { useAuth } from "@/context/AuthContext";
import { removeToken } from "@/services/jwtService";
import UserReservations from "./UserReservationsPage";
import UserEditForm from "@/components/UserEditProfileForm";
import { Restaurant } from "@/types/types";
import CitySearch from "./CitySearchPage";

const CustomerDashboardPage: React.FC = () => {
  const [activeView, setActiveView] = useState<
    | "RESERVATION SCHEDULE"
    | "HISTORY"
    | "SETTINGS"
    | "LOGOUT"
    | "MY RESERVATIONS"
    | "PROFILE"
    | "SEARCH FOR RESTAURANT"
  >("MY RESERVATIONS");

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const { setAuth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "Customer") {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

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

  const handleSearchResults = (searchResults: Restaurant[]) => {
    console.log(restaurants)
    setRestaurants(searchResults);
    navigate("/results", { state: { restaurants: searchResults } });
    console.log("Search Results:", searchResults);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-[300px] bg-gray-50">
        <SideBar onNavigate={setActiveView} restaurantId={0} role="Customer" />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar title={activeView} />

        <div className="p-8">
          {activeView === "MY RESERVATIONS" && (
            <UserReservations userId={user?.userId} />
          )}
          {activeView === "SEARCH FOR RESTAURANT" && (
            <CitySearch onSearch={handleSearchResults} />
          )}
          {activeView === "PROFILE" && <UserEditForm />}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
