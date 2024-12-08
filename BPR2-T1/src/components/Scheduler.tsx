import { useState, useEffect } from "react";
import { fetchRestaurant } from "@/api/restaurantApi";
import { Button } from "@/components/ui/button";
import { ReservationData } from "@/types/types";

interface Restaurant {
  id: number;
  name: string;
  reservations: { $values: ReservationData[] };
}

interface SchedulerProps {
  restaurantId: number;
  selectedDate: Date | null;
}

interface Slot {
  name: string;
  people: number;
  time: string;
}

const Scheduler: React.FC<SchedulerProps> = ({
  restaurantId,
  selectedDate,
}) => {
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

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [allSchedules, setAllSchedules] = useState<
    { time: string; slots: Slot[] }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);

  const slotsPerPage = 6;

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantData = await fetchRestaurant(restaurantId);
        console.log("Fetched restaurant data:", restaurantData);
        console.log("Fetched reservations data:", restaurantData.reservations);

        setRestaurant(restaurantData);
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);


  useEffect(() => {
    if (!restaurant || !selectedDate) {
      setAllSchedules([]);
      return;
    }

    
    const adjustedDate = new Date(selectedDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1);

    
    const dateString = adjustedDate.toISOString().split("T")[0];
    console.log(dateString);

    const filteredReservations = (
      restaurant.reservations?.$values || []
    ).filter((reservation) => reservation.date.startsWith(dateString));

    const parseTime = (time: string) => {
      const [timePart, period] = time.split(" ");
      const [hours, minutes] = timePart.split(":").map(Number);
      return new Date(
        0,
        0,
        0,
        period === "PM" && hours !== 12
          ? hours + 12
          : hours === 12 && period === "AM"
          ? 0
          : hours,
        minutes
      );
    };

    const updatedSchedules = staticTimeSlots.map((timeSlot) => {
      const [start, end] = timeSlot.split(" - ").map(parseTime);

      const matchingReservations = filteredReservations.filter(
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
  }, [restaurant, selectedDate]);


  const displayedSchedules = allSchedules.slice(
    currentPage * slotsPerPage,
    (currentPage + 1) * slotsPerPage
  );

  const handleNext = () => {
    if ((currentPage + 1) * slotsPerPage < allSchedules.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 xl:justify-center xl:flex ">
        Schedule for {selectedDate?.toLocaleDateString()}
      </h2>
      <div className="flex gap-2 flex-wrap xl:justify-center items-center ">
        {displayedSchedules.map((schedule, index) => (
          <div key={index} className="p-4 border rounded shadow-lg ">
            <h3 className="text-lg font-semibold">{schedule.time}</h3>
            <div>
              {schedule.slots.length > 0 ? (
                schedule.slots.map((slot, idx) => (
                  <div key={idx}>
                    <div className="font-semibold mt-2">{slot.name}</div>
                    <div>People: {slot.people}</div>
                    <div>Time: {slot.time}</div>
                  </div>
                ))
              ) : (
                <span className="text-gray-500">No Reservations </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={(currentPage + 1) * slotsPerPage >= allSchedules.length}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Scheduler;
