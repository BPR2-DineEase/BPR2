import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ReserveDialogComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReserveDialogComponent({ isOpen, onClose }: ReserveDialogComponentProps) {
  const [guestName, setGuestName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [comments, setComments] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(date);
    alert(`Reservation confirmed for ${guestName}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-full">
        <DialogTitle>Reservation Details</DialogTitle>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="guestName" className="text-right">
              Name
            </Label>
            <Input
              id="guestName"
              value={guestName}
              required
              onChange={(e) => setGuestName(e.target.value)}
              className="col-span-3"
              placeholder="Enter Users name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              required
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="col-span-3"
              placeholder="Enter Users phone number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="col-span-3"
              placeholder="Enter Users email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              value={time}
              required
              onChange={(e) => setTime(e.target.value)}
              type="text"
              className="col-span-3"
              placeholder="Enter time of the reservation E.g. 21:00"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Time
            </Label>
            <Input
              id="date"
              value={date}
              required
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="col-span-3"
              placeholder="Enter time of the reservation E.g. 21:00"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comments" className="text-right">
              Comments
            </Label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
              className="col-span-3 border rounded-md p-2"
              placeholder="Add any comments"
            />
          </div>
          <DialogFooter className="flex justify-between mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
