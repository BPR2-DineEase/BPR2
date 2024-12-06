import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cancelReservation } from "@/api/ReservationApi";
import {useState} from "react";

interface CancelDialogProps {
    isOpen: boolean;
    onClose: () => void;
    reservationId: number;
    onCancelSuccess: (reservationId: number) => void;
}

const CancelDialog: React.FC<CancelDialogProps> = ({ isOpen, onClose, reservationId, onCancelSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        setLoading(true);
        try {
            await cancelReservation(reservationId.toString());
            onCancelSuccess(reservationId);
            onClose();
        } catch (error) {
            console.error("Failed to cancel reservation:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Reservation</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to cancel this reservation?</p>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>
                        No
                    </Button>
                    <Button variant="destructive" onClick={handleCancel} disabled={loading}>
                        {loading ? "Canceling..." : "Yes, Cancel"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default CancelDialog;
