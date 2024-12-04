import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Restaurant } from "@/api/restaurantApi";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const mockRestaurant: Restaurant = {
  id: 1,
  name: "The Gourmet Spot",
  city: "New York",
  cuisine: "Italian",
  rating: 4.5,
  latitude: 40.7128,
  longitude: -74.006,
};

const SettingsComponent: React.FC = () => {
  const [restaurant, setRestaurant] = useState<Restaurant>(mockRestaurant);
  const [availablePeople, setAvailablePeople] = useState<number | undefined>();
  const [openingHour, setOpeningHour] = useState("");
  const [closingHour, setClosingHour] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRestaurant((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseFloat(value) : value,
    }));
  };

  const handleAvailablePeopleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAvailablePeople(parseInt(e.target.value, 10) || undefined);
  };

  const handleOpeningHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpeningHour(formatTime(e.target.value));
  };

  const handleClosingHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClosingHour(formatTime(e.target.value));
  };

  const formatTime = (time: string): string => {
    return time.replace(":", ".").trim();
  };

  const handleSubmit = () => {
    const openingHours = `${openingHour} - ${closingHour}`;
    console.log("Updated Restaurant:", {
      ...restaurant,
      availablePeople,
      openingHours,
    });
    // TODO: Send updated data to the API
  };

  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Edit Restaurant Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={restaurant.name}
                onChange={handleInputChange}
                placeholder="Restaurant Name"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={restaurant.city}
                onChange={handleInputChange}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="cuisine">Cuisine</Label>
              <Input
                id="cuisine"
                name="cuisine"
                value={restaurant.cuisine}
                onChange={handleInputChange}
                placeholder="Cuisine"
              />
            </div>
            <div>
              <Label htmlFor="availablePeople">Available People</Label>
              <Input
                id="availablePeople"
                type="number"
                value={availablePeople || ""}
                onChange={handleAvailablePeopleChange}
                placeholder="Max Number of People"
              />
            </div>
            <div>
              <Label htmlFor="openingHour">Opening Hour</Label>
              <Input
                id="openingHour"
                value={openingHour}
                onChange={handleOpeningHourChange}
                placeholder="e.g., 13:00"
              />
            </div>
            <div>
              <Label htmlFor="closingHour">Closing Hour</Label>
              <Input
                id="closingHour"
                value={closingHour}
                onChange={handleClosingHourChange}
                placeholder="e.g., 21:00"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsComponent;
