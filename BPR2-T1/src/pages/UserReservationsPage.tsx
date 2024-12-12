import { useEffect, useState } from "react";
import { fetchUserReservations } from "@/api/ReservationApi";
// import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UpdateDialog from "@/components/UpdateDialog";
import CancelDialog from "@/components/CancelDialog";
import { ReservationData } from "@/types/types";
import { toast } from "@/hooks/use-toast.ts";


const UserReservations: React.FC = ({ userId }) => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationData | null>(null);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);

  // const location = useLocation();
  // const userId = location.state?.userId;

  useEffect(() => {
    const fetchReservations = async () => {
      if (!userId) {
        console.error("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchUserReservations(userId);
        const formattedData = data.map((reservation: ReservationData) => ({
          ...reservation,
          date: new Date(reservation.date).toISOString(),
        }));
        setReservations(formattedData);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId]);

  const handleUpdateSuccess = (updatedReservation: ReservationData) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === updatedReservation.id
          ? updatedReservation
          : reservation
      )
    );
    toast({
      title: "Reservation Updated",
      description: "Your reservation has been successfully updated.",
      duration: 3000,
    });
  };

  const handleCancelSuccess = (reservationId: number) => {
    setReservations((prev) =>
      prev.filter((reservation) => reservation.id !== reservationId)
    );
    toast({
      title: "Reservation Canceled",
      description: "Your reservation has been successfully canceled.",
      duration: 3000,
    });
  };

  const openUpdateDialog = (reservation: ReservationData) => {
    setSelectedReservation(reservation);
    setUpdateDialogOpen(true);
  };

  const openCancelDialog = (reservation: ReservationData) => {
    setSelectedReservation(reservation);
    setCancelDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">No Reservations Found</h3>
          <p className="text-gray-500">
            You currently have no reservations. Start booking now!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Reservations</h2>
        <p className="text-lg text-gray-600">
          Total Reservations:{" "}
          <span className="font-semibold">{reservations.length}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">
                Reservation at {reservation.restaurant?.name || "N/A"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(reservation.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {reservation.time}
              </p>
              <p>
                <strong>Guests:</strong> {reservation.numOfPeople}
              </p>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => openUpdateDialog(reservation)}>
                  Update
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => openCancelDialog(reservation)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedReservation && (
        <>
          <UpdateDialog
            isOpen={isUpdateDialogOpen}
            onClose={() => setUpdateDialogOpen(false)}
            reservation={selectedReservation}
            onUpdateSuccess={handleUpdateSuccess}
          />
          <CancelDialog
            isOpen={isCancelDialogOpen}
            onClose={() => setCancelDialogOpen(false)}
            reservationId={selectedReservation.id!}
            onCancelSuccess={handleCancelSuccess}
          />
        </>
      )}
    </div>
  );
};

export default UserReservations;
