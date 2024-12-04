import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRestaurantById } from "@/api/restaurantApi";

const HistoryComponent: React.FC<{ restaurantId: number }> = ({
  restaurantId,
}) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  // Fetch reservations for the restaurant
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantData = await getRestaurantById(restaurantId);
        setReservations(restaurantData.reservations?.$values || []);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  const filteredReservations = reservations.filter((reservation) => {
    return (
      reservation.guestName.toLowerCase().includes(searchName.toLowerCase()) &&
      reservation.email.toLowerCase().includes(searchEmail.toLowerCase())
    );
  });

  return (
    <div>
      <div className="flex justify-center items-center h-full">
        <input
          type="text"
          className="bg-red-100 rounded-xl border border-slate-200 p-1 ml-2"
          placeholder="Search for a user"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          className="bg-red-100 rounded-xl border border-slate-200 p-1 ml-2"
          placeholder="Search for a user email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <Table>
          <TableCaption>Recent Reservations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Guest Name</TableHead>
              <TableHead>Number of People</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(reservation.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{reservation.time}</TableCell>
                  <TableCell>{reservation.guestName}</TableCell>
                  <TableCell>{reservation.numOfPeople}</TableCell>
                  <TableCell>{reservation.phoneNumber}</TableCell>
                  <TableCell>{reservation.email}</TableCell>
                  <TableCell>{reservation.comments}</TableCell>
                  <TableCell>{reservation.company}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No reservations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoryComponent;
