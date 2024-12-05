import { getRestaurantById } from "@/api/restaurantApi";
import { useState, useEffect } from "react";

interface Reservation {
  guestName: string;
  numOfPeople: number;
  date: string;
}

interface Restaurant {
  id: number;
  name: string;
  reservations: { $values: Reservation[] };
}

interface SchedulerProps {
  restaurantId: number;
}

interface Slot {
  name: string;
  people: number;
  time: string; 
}

const Scheduler: React.FC<SchedulerProps> = ({ restaurantId }) => {
  
  const staticTimeSlots = [
    "09:00 AM - 09:30 AM",
    "09:30 AM - 10:00 AM",
    "10:00 AM - 10:30 AM",
    "10:30 AM - 11:00 AM",
    "11:00 AM - 11:30 AM",
    "11:30 AM - 12:00 PM",
    "12:00 PM - 12:30 PM",
    "12:30 PM - 01:00 PM",
    "01:00 PM - 01:30 PM",
    "01:30 PM - 02:00 PM",
    "02:00 PM - 02:30 PM",
    "02:30 PM - 03:00 PM",
    "03:00 PM - 03:30 PM",
    "03:30 PM - 04:00 PM",
    "04:00 PM - 04:30 PM",
    "04:30 PM - 05:00 PM",
    "05:00 PM - 05:30 PM",
    "05:30 PM - 06:00 PM",
    "06:00 PM - 06:30 PM",
    "06:30 PM - 07:00 PM",
    "07:00 PM - 07:30 PM",
    "07:30 PM - 08:00 PM",
    "08:00 PM - 08:30 PM",
    "08:30 PM - 09:00 PM",
    "09:00 PM - 09:30 PM",
    "09:30 PM - 10:00 PM",
    "10:00 PM - 10:30 PM",
    "10:30 PM - 11:00 PM",
    "11:00 PM - 11:30 PM",
    "11:30 PM - 12:00 AM",
  ];

  const [allSchedules, setAllSchedules] = useState<
    { time: string; slots: Slot[] }[]
  >([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);

  const visibleSlots = staticTimeSlots.slice(
    currentStartIndex,
    currentStartIndex + 6
  );

  const canGoBack = currentStartIndex > 0;
  const canGoForward = currentStartIndex + 6 < staticTimeSlots.length;

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantData = await getRestaurantById(restaurantId);
        setRestaurant(restaurantData);
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  useEffect(() => {
    if (!restaurant || !restaurant.reservations?.$values) return;

    const parseTime = (time: string) => {
      const [timePart, period] = time.split(" ");
      const [hours, minutes] = timePart.split(":").map(Number);
      const adjustedHours =
        period === "PM" && hours !== 12
          ? hours + 12
          : period === "AM" && hours === 12
          ? 0
          : hours;
      return new Date(0, 0, 0, adjustedHours, minutes); 
    };

    const updatedSchedules = staticTimeSlots.map((timeSlot) => {
      const [start, end] = timeSlot.split(" - ").map(parseTime);

      const matchingReservations = restaurant.reservations.$values.filter(
        (reservation) => {
          const reservationTime = parseTime(
            new Date(reservation.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          );
          return reservationTime >= start && reservationTime < end;
        }
      );

      return {
        time: timeSlot,
        slots: matchingReservations.map((reservation) => ({
          name: reservation.guestName,
          people: reservation.numOfPeople,
          time: new Date(reservation.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }), 
        })),
      };
    });

    setAllSchedules(updatedSchedules);
  }, [restaurant]);

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {visibleSlots.map((time, index) => (
                <th
                  key={index}
                  className="border border-gray-300 p-2 text-center text-sm" 
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
                    {matchingSlot?.slots.length ? (
                      matchingSlot.slots.map((entry, idx) => (
                        <div key={idx} className="p-2 m-2 rounded">
                          <div className="font-bold">{entry.name}</div>
                          <div>People: {entry.people}</div>
                          <div>Time: {entry.time}</div>{" "}
                        </div>
                      ))
                    ) : (
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
          onClick={() => setCurrentStartIndex((prev) => prev - 6)}
        >
          Previous
        </button>
        <button
          className={`p-2 px-4 bg-gray-200 rounded ${
            canGoForward ? "hover:bg-gray-300" : "opacity-50"
          }`}
          disabled={!canGoForward}
          onClick={() => setCurrentStartIndex((prev) => prev + 6)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Scheduler;
