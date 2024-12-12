import logout from "../../public/logout.png";
import settings from "../../public/settings.png";
import history from "../../public/history.png";
import dashboard from "../../public/dashboard.png";
import profile from "../../public/profile.png";
import search from "../../public/searchpng.png";
import DineEaseLogo from "../../public/DineEaseLogo.png";
import restaurantLogo from "../../public/restaurantLogo.png";
import { useEffect, useState } from "react";
import { getImageByRestaurantIdAndType } from "@/api/restaurantApi";

interface SideBarProps {
  onNavigate: (
    view:
      | "RESERVATION SCHEDULE"
      | "HISTORY"
      | "SETTINGS"
      | "LOGOUT"
      | "MY RESERVATIONS"
      | "PROFILE"
      | "SEARCH FOR RESTAURANT"
  ) => void;
  role: "RestaurantOwner" | "Customer";
  restaurantId: number;
}

const SideBar: React.FC<SideBarProps> = ({
  onNavigate,
  role,
  restaurantId,
}) => {
  const [logoUrl, setLogoUrl] = useState<string>(restaurantLogo);

  useEffect(() => {
    const fetchImages = async () => {
      const url = await getImageByRestaurantIdAndType(restaurantId, "logo");
      console.log(url)
      setLogoUrl(url.$values[0]);
    };

    fetchImages();
  }, [restaurantId]);

  return (
    <div className="flex h-full">
      <div className="flex flex-col">
        <div className="flex justify-center h-52 items-center">
          {role === "RestaurantOwner" && (
            <img src={logoUrl} className="p-4" alt="Restaurant Logo" />
          )}
          {role === "Customer" && (
            <img src={DineEaseLogo} className="p-4" alt="Restaurant Logo" />
          )}
        </div>

        <div className="flex flex-col h-full mr-12 w-60">
          <div className="flex flex-col mt-44 ml-14">
            {role === "Customer" && (
              <>
                <div
                  onClick={() => onNavigate("SEARCH FOR RESTAURANT")}
                  className="flex mt-4 items-center space-x-6 rounded-xl p-2 cursor-pointer hover:bg-blue-200 transform transition duration-300"
                >
                  <img
                    src={search}
                    alt="Search for a restaurant Logo"
                    className="max-h-6 ml-1 my-[5px]"
                  />
                  <h1 className="text-xl text-blue-400 font-semibold mr-1">
                    Search for Restaurant
                  </h1>
                </div>
                <div
                  onClick={() => onNavigate("MY RESERVATIONS")}
                  className="flex items-center space-x-6 rounded-xl p-2 cursor-pointer hover:bg-blue-200 transform transition duration-300"
                >
                  <img
                    src={dashboard}
                    alt="Dashboard Logo"
                    className="max-h-6 ml-1 my-[5px]"
                  />
                  <h1 className="text-xl text-blue-400 font-semibold ">
                    My Reservations
                  </h1>
                </div>

                <div
                  onClick={() => onNavigate("PROFILE")}
                  className="flex mt-4 items-center space-x-6 rounded-xl p-2 cursor-pointer hover:bg-blue-200 transform transition duration-300"
                >
                  <img
                    src={profile}
                    alt="Profile"
                    className="max-h-6 ml-1 my-[5px]"
                  />
                  <h1 className="text-xl text-blue-400 font-semibold mr-1">
                    Profile
                  </h1>
                </div>
                <div
                  onClick={() => onNavigate("LOGOUT")}
                  className="flex mt-4 items-center space-x-6 rounded-xl p-2 cursor-pointer hover:bg-blue-200 transform transition duration-300"
                >
                  <img
                    src={logout}
                    alt="Logout Logo"
                    className="max-h-6 ml-1 my-[5px]"
                  />
                  <h1 className="text-xl text-blue-400 font-semibold mr-1">
                    Log Out
                  </h1>
                </div>
              </>
            )}

            {role === "RestaurantOwner" && (
              <>
                <div
                  onClick={() => onNavigate("RESERVATION SCHEDULE")}
                  className="flex items-center space-x-6 rounded-xl p-2 cursor-pointer hover:bg-blue-200 transform transition duration-300"
                >
                  <img
                    src={dashboard}
                    alt="Dashboard Logo"
                    className="max-h-6 ml-1 my-[5px]"
                  />
                  <h1 className="text-xl text-blue-400 font-semibold mr-1">
                    Dashboard
                  </h1>
                </div>
                <div
                  onClick={() => onNavigate("HISTORY")}
                  className="flex mt-4 items-center space-x-6 rounded-xl p-2 cursor-pointer hover:bg-blue-200 transform transition duration-300"
                >
                  <img
                    src={history}
                    alt="History Logo"
                    className="max-h-6 ml-1 my-[5px]"
                  />
                  <h1 className="text-xl text-blue-400 font-semibold mr-1">
                    History
                  </h1>
                </div>
                <div
                  onClick={() => onNavigate("SETTINGS")}
                  className="flex mt-4 items-center space-x-6 rounded-xl p-2 cursor-pointer hover:bg-blue-200 transform transition duration-300"
                >
                  <img
                    src={settings}
                    alt="Settings Logo"
                    className="max-h-6 ml-1 my-[5px]"
                  />
                  <h1 className="text-xl text-blue-400 font-semibold">
                    Settings
                  </h1>
                </div>
                <div
                  onClick={() => onNavigate("LOGOUT")}
                  className="flex mt-4 items-center space-x-6 rounded-xl p-2 cursor-pointer hover:bg-blue-200 transform transition duration-300"
                >
                  <img
                    src={logout}
                    alt="Logout Logo"
                    className="max-h-6 ml-1 my-[5px]"
                  />
                  <h1 className="text-xl text-blue-400 font-semibold mr-1">
                    Log Out
                  </h1>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-[1px] bg-slate-300 h-full ml-11"></div>
    </div>
  );
};

export default SideBar;
