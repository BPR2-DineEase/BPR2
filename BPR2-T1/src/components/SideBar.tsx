import logout from "../../public/logout.png";
import settings from "../../public/settings.png";
import history from "../../public/history.png";
import dashboard from "../../public/dashboard.png";
import restaurantLogo from "../../public/restaurantLogo.png";

const SideBar: React.FC = () => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col">
        <div className="flex justify-center h-52 items-center">
          <img src={restaurantLogo} alt="Restaurant Logo" />
        </div>

        <div className="flex flex-col h-full mr-12 w-60">
          <div className="flex flex-col mt-44 ml-14">
            <div className="flex items-center space-x-6 rounded-xl p-2 cursor-pointer hover:bg-blue-200 transform transition duration-300">
              <img
                src={dashboard}
                alt="dashboard logo"
                className="max-h-6 ml-1 my-[5px]"
              />
              <h1 className="text-xl text-blue-400 font-semibold mr-1 ">
                Dashboard
              </h1>
            </div>
            <div className="flex mt-4 items-center space-x-6 rounded-xl p-2 cursor-pointer hover:bg-blue-200 transform transition duration-300">
              <img
                src={history}
                alt="History logo"
                className="max-h-6 ml-1 my-[5px]"
              />
              <h1 className="text-xl text-blue-400 font-semibold mr-1">
                History
              </h1>
            </div>
            <div className="flex mt-4 items-center space-x-6 rounded-xl p-2 cursor-pointer hover:bg-blue-200 transform transition duration-300">
              <img
                src={settings}
                alt="settings logo"
                className="max-h-6 ml-1 my-[5px]"
              />
              <h1 className="text-xl text-blue-400 font-semibold">Settings</h1>
            </div>
            <div className="flex mt-4 items-center space-x-6 rounded-xl p-2 cursor-pointer hover:bg-blue-200 transform transition duration-300">
              <img
                src={logout}
                alt="logout logo"
                className="max-h-6 ml-1 my-[5px]"
              />
              <h1 className="text-xl text-blue-400 font-semibold mr-1">
                Log Out
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[1px] bg-slate-300 h-full ml-11"></div>
    </div>
  );
};

export default SideBar;
