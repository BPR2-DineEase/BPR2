import { useState } from "react";

const Scheduler = () => {
  const staticTimeSlots = [
    "9:00 - 9:30 AM",
    "9:30 - 10:00 AM",
    "10:00 - 10:30 AM",
    "10:30 - 11:00 AM",
    "11:00 - 11:30 AM",
    "11:30 - 12:00 PM",
    "12:00 - 12:30 PM",
    "12:30 - 1:00 PM",
    "1:00 - 1:30 PM",
    "1:30 - 2:00 PM",
    "2:00 - 2:30 PM",
    "3:00 - 3:30 PM",
    "3:30 - 4:00 PM",
    "4:00 - 4:30 PM",
    "4:30 - 5:00 PM",
    "5:00 - 5:30 PM",
    "5:30 - 6:00 PM",
    "6:00 - 6:30 PM",
    "6:30 - 7:00 PM",
    "7:00 - 7:30 PM",
    "7:30 - 8:00 PM",
    "8:00 - 8:30 PM",
    "8:30 - 9:00 PM",
    "9:00 - 9:30 PM",
    "9:30 - 10:00 PM",
    "11:00 - 11:30 PM",
    "11:30 - 12:00 AM",
  ];

 const allSchedules = [
   {
     time: "9:00 - 9:30 AM",
     slots: [
       { name: "Alice", people: 2, status: "Confirmed" },
       { name: "Tom", people: 5, status: "Confirmed" },
     ],
   },
   {
     time: "9:30 - 10:00 AM",
     slots: [
       { name: "Bella", people: 4, status: "Cancelled" },
       { name: "Emma", people: 6, status: "Confirmed" },
     ],
   },
   {
     time: "10:00 - 10:30 AM",
     slots: [
       { name: "Anna", people: 2, status: "Pending" },
       { name: "Mary", people: 3, status: "Cancelled" },
       { name: "John", people: 10, status: "Confirmed" },
     ],
   },
   {
     time: "10:30 - 11:00 AM",
     slots: [
       { name: "Corbin", people: 2, status: "Confirmed" },
       { name: "Sophie", people: 8, status: "Pending" },
     ],
   },
   {
     time: "11:00 - 11:30 AM",
     slots: [
       { name: "Elias", people: 3, status: "Confirmed" },
       { name: "Jake", people: 7, status: "Confirmed" },
     ],
   },
   {
     time: "11:30 - 12:00 PM",
     slots: [
       { name: "Rory", people: 2, status: "Confirmed" },
       { name: "Olivia", people: 4, status: "Cancelled" },
     ],
   },
   {
     time: "12:00 - 12:30 PM",
     slots: [
       { name: "Edsel", people: 4, status: "Confirmed" },
       { name: "Liam", people: 8, status: "Pending" },
     ],
   },
   {
     time: "12:30 - 1:00 PM",
     slots: [{ name: "Sophia", people: 2, status: "Confirmed" }],
   },
   {
     time: "1:00 - 1:30 PM",
     slots: [
       { name: "Michael", people: 5, status: "Cancelled" },
       { name: "Chloe", people: 6, status: "Confirmed" },
     ],
   },
   {
     time: "1:30 - 2:00 PM",
     slots: [
       { name: "Lucas", people: 3, status: "Confirmed" },
       { name: "Sarah", people: 9, status: "Confirmed" },
     ],
   },
   {
     time: "2:00 - 2:30 PM",
     slots: [{ name: "Mia", people: 7, status: "Pending" }],
   },
   {
     time: "3:00 - 3:30 PM",
     slots: [
       { name: "Noah", people: 4, status: "Pending" },
       { name: "Ava", people: 3, status: "Confirmed" },
     ],
   },
   {
     time: "3:30 - 4:00 PM",
     slots: [
       { name: "Ella", people: 6, status: "Confirmed" },
       { name: "James", people: 10, status: "Cancelled" },
     ],
   },
   {
     time: "4:00 - 4:30 PM",
     slots: [
       { name: "Logan", people: 8, status: "Pending" },
       { name: "Isabella", people: 2, status: "Confirmed" },
     ],
   },
   {
     time: "4:30 - 5:00 PM",
     slots: [{ name: "Ethan", people: 4, status: "Confirmed" }],
   },
   {
     time: "5:00 - 5:30 PM",
     slots: [
       { name: "Sophia", people: 3, status: "Pending" },
       { name: "Mason", people: 6, status: "Confirmed" },
     ],
   },
   {
     time: "5:30 - 6:00 PM",
     slots: [
       { name: "Aiden", people: 7, status: "Confirmed" },
       { name: "Lily", people: 4, status: "Pending" },
     ],
   },
   {
     time: "6:00 - 6:30 PM",
     slots: [
       { name: "Olivia", people: 8, status: "Confirmed" },
       { name: "Ella", people: 5, status: "Cancelled" },
     ],
   },
   {
     time: "6:30 - 7:00 PM",
     slots: [{ name: "Zoe", people: 2, status: "Confirmed" }],
   },
   {
     time: "7:00 - 7:30 PM",
     slots: [
       { name: "Jack", people: 9, status: "Confirmed" },
       { name: "Luna", people: 3, status: "Confirmed" },
     ],
   },
   {
     time: "7:30 - 8:00 PM",
     slots: [
       { name: "Benjamin", people: 10, status: "Pending" },
       { name: "Grace", people: 6, status: "Confirmed" },
     ],
   },
   {
     time: "8:00 - 8:30 PM",
     slots: [{ name: "Aria", people: 4, status: "Confirmed" }],
   },
   {
     time: "8:30 - 9:00 PM",
     slots: [
       { name: "Henry", people: 7, status: "Confirmed" },
       { name: "Mila", people: 5, status: "Cancelled" },
     ],
   },
   {
     time: "9:00 - 9:30 PM",
     slots: [{ name: "Elijah", people: 3, status: "Pending" }],
   },
 ];



  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const visibleSlots = staticTimeSlots.slice(
    currentStartIndex,
    currentStartIndex + 6
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-orange-300";
      case "Confirmed":
        return "bg-green-300";
      case "Cancelled":
        return "bg-red-300";
      default:
        return "bg-gray-200";
    }
  };

  const canGoBack = currentStartIndex > 0;
  const canGoForward = currentStartIndex + 4 < staticTimeSlots.length;

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {visibleSlots.map((time, index) => (
                <th
                  key={index}
                  className="border border-gray-300 p-2 text-center"
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {visibleSlots.map((time, index) => {
                const matchingSlot = allSchedules.find(
                  (slot) => slot.time === time
                );

                return (
                  <td key={index} className="border border-gray-300 p-2">
                    {matchingSlot?.slots.map((entry, idx) => (
                      <div
                        key={idx}
                        className={`p-2 m-2 rounded ${getStatusColor(
                          entry.status
                        )}`}
                      >
                        <div className="font-bold">{entry.name}</div>
                        <div>People: {entry.people}</div>
                      </div>
                    )) || (
                      <div className="text-gray-500 text-center">
                        No Reservations
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          className={`p-2 px-4 bg-gray-200 rounded ${
            canGoBack ? "hover:bg-gray-300" : "opacity-50"
          }`}
          disabled={!canGoBack}
          onClick={() => setCurrentStartIndex(currentStartIndex - 6)}
        >
          Previous
        </button>
        <button
          className={`p-2 px-4 bg-gray-200 rounded ${
            canGoForward ? "hover:bg-gray-300" : "opacity-50"
          }`}
          disabled={!canGoForward}
          onClick={() => setCurrentStartIndex(currentStartIndex + 6)}
        >
          Next
        </button>
      </div>

      <div className="mt-[20px] flex justify-center">
        <div className="flex gap-4">
          <div className="flex items-center">
            <span className="bg-orange-400 h-5 w-5 rounded-full mr-2"></span>
            <span>Pending</span>
          </div>

          <div className="flex items-center">
            <span className="bg-green-400 h-5 w-5 rounded-full mr-2"></span>
            <span>Confirmed</span>
          </div>

          <div className="flex items-center">
            <span className="bg-red-400 h-5 w-5 rounded-full mr-2"></span>
            <span>Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
