import React from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReservationProccess from "./ReservationProccess";
import { postReservation } from "@/api/ReservationApi";
import { useAuth } from "@/context/AuthContext.tsx";
import { cn } from "@/lib/utils.ts";
import { useNavigate, useSearchParams } from "react-router-dom";

const TableReservation = () => {
  const [comments, setComment] = React.useState<string>("");
  const [company, setCompany] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [guestName, setName] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");

  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>("");
  const [numOfPeople, setNumOfPeople] = React.useState<number>();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState<boolean>(false);
  const today = startOfDay(new Date());
  const { user } = useAuth();

  const [searchParams] = useSearchParams();
  const restaurantId = Number(searchParams.get("restaurantId"));
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !numOfPeople) return;

    if (!user) {
      alert("You must be logged in to make a reservation.");
      return;
    }

    const userId = user.userId;
    const adjustedDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    const dateString = adjustedDate.toISOString();

    try {
      await postReservation({
        guestName,
        phoneNumber,
        email,
        company,
        comments,
        date: dateString,
        time,
        numOfPeople,
        userId,
        restaurantId,
      });

      alert("Reservation created successfully");

      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to create Reservation.", err);
    }

    setDate(undefined);
    setTime("");
    setIsPopoverOpen(false);
    setNumOfPeople(0);
    setComment("");
    setEmail("");
    setName("");
    setPhoneNumber("");
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate && !isBefore(selectedDate, today)) {
      setDate(selectedDate);
      setIsPopoverOpen(false);
    }
  };
  const getStep = () => {
    if (!date) return 1;
    if (!time) return 2;
    if (!numOfPeople) return 3;
    return 4;
  };

  return (
    <>
      <ReservationProccess step={getStep()} />

      <div className="flex justify-center w-full h-full mt-6">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            >
              <CalendarIcon />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
              disabled={(date) => isBefore(date, today)}
              className="w-full"
            />
          </PopoverContent>
        </Popover>
      </div>

      {date && (
        <div className="flex justify-center w-full mt-4">
          <input
            type="time"
            value={time}
            required
            onChange={(e) => setTime(e.target.value)}
            className="w-[300px] p-2 border rounded-md shadow-sm"
          />
        </div>
      )}

      {time && (
        <div className="flex justify-center w-full mt-4">
          <input
            type="number"
            value={numOfPeople || ""}
            required
            placeholder="How many people are coming?"
            onChange={(e) => setNumOfPeople(parseInt(e.target.value))}
            className="w-[300px] p-2 border rounded-md shadow-sm"
          />
        </div>
      )}
      {numOfPeople && (
        <div className="mt-10 flex justify-center">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-auto items-center gap-4">
                  <div className="flex gap-2">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={guestName}
                        required
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="PhoneNumber">Phone Number</Label>
                      <Input
                        id="PhoneNumber"
                        value={phoneNumber}
                        required
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        type="number"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        type="text"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter your e-mail address"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="Comment">Comment</Label>
                    <textarea
                      className="border-2 rounded-lg"
                      id="Comment"
                      value={comments}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={100}
                      placeholder="If you have any comments"
                    />
                  </div>
                </div>
                <CardFooter className="flex justify-between mt-10">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit">Confirm</Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default TableReservation;
