import React from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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


const TableReservation = () => {
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>("");
  const [numOfPeople, setNumOfPeople] = React.useState<number>();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState<boolean>(false);
  const today = startOfDay(new Date());

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

      {/* Date Picker */}
      <div className="flex justify-center w-full h-full mt-6">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              onClick={() => setIsPopoverOpen(!isPopoverOpen)} // Toggle popover on button click
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
            placeholder="How many people are coming?"
            onChange={(e) => setNumOfPeople(parseInt(e.target.value))}
            className="w-[300px] p-2 border rounded-md shadow-sm"
          />
        </div>
      )}
      {numOfPeople && (
        <div className="mt-10 flex justify-center">
          <Card className="w-[350px] ">
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-auto items-center gap-4">
                  <div className="flex gap-2">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="PhoneNumber">Phone Number</Label>
                      <Input
                        id="PhoneNumber"
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
                        type="text"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
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
                      maxLength={100}
                      placeholder="If you have any comments"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default TableReservation;
