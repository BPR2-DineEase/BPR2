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
}

const Scheduler: React.FC<SchedulerProps> = ({ restaurantId }) => {
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

  const [allSchedules, setAllSchedules] = useState<
    { time: string; slots: Slot[] }[]
  >([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantData = await getRestaurantById(restaurantId);
        console.log("Fetched restaurant data:", restaurantData);
        setRestaurant(restaurantData);
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);


  useEffect(() => {
    if (!restaurant) return;

    console.log("Restaurant Reservations:", restaurant.reservations?.$values); 

    const updatedSchedules = staticTimeSlots.map((timeSlot) => {
      const matchingReservations = restaurant.reservations?.$values.filter(
        (reservation) => {
          const reservationTime = new Date(reservation.date).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          );
          console.log(
            `Checking reservation: ${reservationTime} against slot: ${timeSlot}`
          ); // Log the comparison
          return reservationTime === timeSlot;
        }
      );

      return {
        time: timeSlot,
        slots: matchingReservations
          ? matchingReservations.map((reservation) => ({
              name: reservation.guestName,
              people: reservation.numOfPeople,
            }))
          : [],
      };
    });

    console.log("Updated Schedules:", updatedSchedules); // Log updated schedules
    setAllSchedules(updatedSchedules);
  }, [restaurant]);


  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const visibleSlots = staticTimeSlots.slice(
    currentStartIndex,
    currentStartIndex + 6
  );

  const canGoBack = currentStartIndex > 0;
  const canGoForward = currentStartIndex + 6 < staticTimeSlots.length;

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
                    {matchingSlot?.slots.length ? (
                      matchingSlot.slots.map((entry: Slot, idx: number) => (
                        <div key={idx} className="p-2 m-2 rounded">
                          <div className="font-bold">{entry.name}</div>
                          <div>People: {entry.people}</div>
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
          onClick={() => {
            console.log("Going back to previous slots");
            setCurrentStartIndex(currentStartIndex - 6);
          }}
        >
          Previous
        </button>
        <button
          className={`p-2 px-4 bg-gray-200 rounded ${
            canGoForward ? "hover:bg-gray-300" : "opacity-50"
          }`}
          disabled={!canGoForward}
          onClick={() => {
            console.log("Going forward to next slots");
            setCurrentStartIndex(currentStartIndex + 6);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Scheduler;
