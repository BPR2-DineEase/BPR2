import { useEffect, useState } from "react";
import { fetchUserReservations } from "@/api/ReservationApi.ts";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {ReservationData} from "@/types/types.ts";


const UserReservations: React.FC = () => {
    const [reservations, setReservations] = useState<ReservationData[]>([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const userId = location.state?.userId;

    useEffect(() => {
        const fetchReservations = async () => {
            if (!userId) {
                console.error("User ID is missing.");
                setLoading(false);
                return;
            }

            try {
                const data = await fetchUserReservations(userId);
                console.log("Fetched Reservations:", data);

                if (Array.isArray(data)) {
                    setReservations(data);
                } else {
                    console.error("Unexpected API response structure:", data);
                    setReservations([]);
                }
            } catch (err) {
                console.error("Failed to fetch reservations:", err);
                setReservations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [userId]);

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
                    <p className="text-gray-500">You currently have no reservations. Start booking now!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Your Reservations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservations.map((reservation) => {
                    const restaurantName = reservation.restaurant?.name || "Restaurant Name Not Available";
                    return (
                        <Card key={reservation.id} className="shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">Reservation at {restaurantName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Date:</strong> {new Date(reservation.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {reservation.time}</p>
                                <p><strong>Guests:</strong> {reservation.numOfPeople}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default UserReservations;