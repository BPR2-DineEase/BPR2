import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data based on ReservationData
const mockReservations = [
  {
    date: new Date("2024-12-03"),
    time: "7:00 PM",
    numOfPeople: 4,
    guestName: "John Doe",
    phoneNumber: "123-456-7890",
    comments: "Celebrating a birthday",
    company: "ABC Corp.",
    email: "johndoe@example.com",
  },
  {
    date: new Date("2024-12-04"),
    time: "6:30 PM",
    numOfPeople: 2,
    guestName: "Jane Smith",
    phoneNumber: "987-654-3210",
    comments: "Prefers a quiet table",
    company: "XYZ Ltd.",
    email: "janesmith@example.com",
  },
  {
    date: new Date("2024-12-05"),
    time: "8:00 PM",
    numOfPeople: 6,
    guestName: "Alice Johnson",
    phoneNumber: "456-789-0123",
    comments: "Anniversary celebration",
    company: "Johnson & Co.",
    email: "alicej@example.com",
  },
];

const HistoryComponent: React.FC = () => {
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const filteredReservations = mockReservations.filter((reservation) => {
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
                  <TableCell>{reservation.date.toLocaleDateString()}</TableCell>
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
