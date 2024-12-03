import Navbar from "@/components/Navbar";
import Scheduler from "@/components/Scheduler";
import SideBar from "@/components/SideBar";

const OwnerDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-[300px] bg-gray-50">
        <SideBar />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 p-8">
          <div className="h-16 flex justify-center space-x-12">
            <div className="bg-red-200 p-4 w-48 flex justify-center items-center rounded-md">
              Mon 05/12
            </div>
            <div className="bg-purple-300 p-4 w-48 flex justify-center items-center rounded-md">
              Available Seats : 0
            </div>
            <div className="bg-blue-300 p-4 w-48 flex justify-center items-center rounded-md">
              Create Reservation
            </div>
          </div>
        </div>
        <div className=" h-full">
          <Scheduler />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
