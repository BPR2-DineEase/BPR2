import { getDecodedToken, getUserByEmail } from "@/api/authAPI";
import { CustomCardComponent } from "@/components/CustomCardComponent";
import HistoryComponent from "@/components/HistoryComponent";
import Navbar from "@/components/Navbar";
import { SettingsComponent } from "@/components/SettingsComponent";
import SideBar from "@/components/SideBar";
import { useAuth } from "@/context/AuthContext";
import { removeToken } from "@/services/jwtService";
import { format, startOfDay } from "date-fns";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Scheduler from "@/components/Scheduler";
import { ReserveDialogComponent } from "@/components/ReserveDialogComponent";

const OwnerDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "RESERVATION SCHEDULE" | "HISTORY" | "SETTINGS" | "LOGOUT"
  >("RESERVATION SCHEDULE");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [activeRestaurant, setActiveRestaurant] = useState<any>(null);

  const [date, setDate] = useState<Date>();
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const today = startOfDay(new Date());

  const { setAuth, user } = useAuth();
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
      setUserDetails(user);
      setActiveRestaurant(user.restaurant);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      handleLogout();
    }
  };

  useEffect(() => {
    if (user?.role !== "RestaurantOwner") {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  if (user?.role !== "RestaurantOwner") {
    return null;
  }

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    if (activeView === "LOGOUT") {
      handleLogout();
    }
  }, [activeView]);

  if (!userDetails || !activeRestaurant) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-[300px] bg-gray-50">
        <SideBar onNavigate={setActiveView} role="RestaurantOwner" />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar title={activeView} />

        <div className="flex-1 p-8">
          {activeView === "RESERVATION SCHEDULE" && (
            <div className="h-16 flex justify-center space-x-12 mb-12">
              <CustomCardComponent
                text={
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full text-left font-normal h-8 ",
                          !date && "text-muted-foreground"
                        )}
                        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                      >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="w-full"
                      />
                    </PopoverContent>
                  </Popover>
                }
                bgColor="bg-blue-300"
                width="w-52"
              />
              <CustomCardComponent
                text={`Available Seats: ${activeRestaurant.capacity}`}
                bgColor="bg-purple-300"
                width="w-58"
              />

              <div className="cursor-pointer">
                <CustomCardComponent
                  text="Create Reservation"
                  bgColor="bg-blue-300"
                  width="w-58"
                  onClick={() => setIsDialogOpen(true)}
                />
                {isDialogOpen && (
                  <ReserveDialogComponent
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    restaurantId={activeRestaurant.id}
                  />
                )}
              </div>
            </div>
          )}
          {activeView === "RESERVATION SCHEDULE" && (
            <Scheduler
              restaurantId={activeRestaurant.id}
              selectedDate={date ?? today}
            />
          )}
          {activeView === "HISTORY" && (
            <HistoryComponent restaurantId={activeRestaurant.id} />
          )}
          {activeView === "SETTINGS" && (
            <SettingsComponent restaurantId={activeRestaurant.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
