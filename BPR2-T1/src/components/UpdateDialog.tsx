import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateReservation } from "@/api/ReservationApi";
import { ReservationData, ReservationPayload } from "@/types/types";

interface UpdateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: ReservationData;
    onUpdateSuccess: (updatedReservation: ReservationData) => void;
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({ isOpen, onClose, reservation, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        date: reservation.date.toString().split("T")[0],
        time: reservation.time,
        numOfPeople: reservation.numOfPeople.toString(),
        comments: reservation.comments,
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const updatedData: ReservationPayload = {
                id: reservation.id,
                guestName: reservation.guestName,
                comments: formData.comments,
                phoneNumber: reservation.phoneNumber,
                email: reservation.email,
                company: reservation.company,
                date: new Date(formData.date).toISOString(),
                time: formData.time,
                numOfPeople: parseInt(formData.numOfPeople, 10),
                userId: reservation.userId,
                restaurantId: reservation.restaurantId,
                restaurant: reservation.restaurant,
            };

            await updateReservation(reservation.id!.toString(), updatedData);
            const updatedReservation = { ...reservation, ...updatedData, date: new Date(updatedData.date).toISOString() };
            onUpdateSuccess(updatedReservation);
            onClose();
        } catch (error) {
            console.error("Failed to update reservation:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Reservation</DialogTitle>
                </DialogHeader>
                <div>
                    <label>Date</label>
                    <Input name="date" type="date" value={formData.date} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Time</label>
                    <Input name="time" type="time" value={formData.time} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Guests</label>
                    <Input
                        name="numOfPeople"
                        type="number"
                        value={formData.numOfPeople}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Comments</label>
                    <Textarea
                        name="comments"
                        value={formData.comments}
                        onChange={handleInputChange}
                        placeholder="Add or update your comments here"
                    />
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateDialog;
