import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import {
  getRestaurantById,
  Restaurant,
  updateRestaurant,
} from "@/api/restaurantApi";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export const SettingsComponent: React.FC<{ restaurantId: number }> = ({
  restaurantId,
}) => {
  const [restaurant, setRestaurant] = useState<Restaurant>({
    id: restaurantId,
    name: "",
    city: "",
    cuisine: "",
    rating: 0,
    capacity: 0,
    latitude: 0,
    imageUris: [],
    longitude: 0,
    openHours: "",
    reservations: [],
  });

  const [availablePeople, setAvailablePeople] = useState<number>(0); 
  const [openingHour, setOpeningHour] = useState("");
  const [closingHour, setClosingHour] = useState("");

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantData = await getRestaurantById(restaurantId);
        setRestaurant(restaurantData);
        const [startHour, endHour] = restaurantData.openHours.split(" - ");
        if (!startHour || !endHour) {
          console.error("Invalid openHours format");
          return;
        }
        setOpeningHour(startHour);
        setClosingHour(endHour);

        setAvailablePeople(restaurantData.capacity || 0);
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (restaurant) {
      setRestaurant((prev) => ({
        ...prev,
        [name]: name === "rating" ? parseFloat(value) || 0 : value || "", 
      }));
    }
  };

  const handleAvailablePeopleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAvailablePeople(parseInt(e.target.value, 10) || 0); 
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

  const handleSubmit = async () => {
    if (restaurant) {
      const updatedRestaurant = {
        ...restaurant,
        capacity: availablePeople,
        openHours: `${openingHour} - ${closingHour}`,
        reservations: restaurant.reservations || [], 
        imageUris: restaurant.imageUris || [], 
      };


      try {
        await updateRestaurant(updatedRestaurant); 
        alert("Restaurant updated successfully!");
      } catch (error:any) {
        console.error(
          "Failed to update restaurant:",
          error.response?.data || error.message
        );
        alert("Failed to update restaurant.");
      }
    }
  };


  if (!restaurant) {
    return <div>Loading...</div>;
  }

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
                name="name"
                value={restaurant?.name || ""}
                onChange={handleInputChange}
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
                value={availablePeople}
                onChange={handleAvailablePeopleChange}
                placeholder="Available People"
              />
            </div>
            <div>
              <Label htmlFor="openingHour">Opening Hour</Label>
              <Input
                id="openingHour"
                type="text"
                value={openingHour}
                onChange={handleOpeningHourChange}
                placeholder="E.g. 10.00"
              />
            </div>
            <div>
              <Label htmlFor="closingHour">Closing Hour</Label>
              <Input
                id="closingHour"
                type="text"
                value={closingHour}
                onChange={handleClosingHourChange}
                placeholder="E.g. 21.00"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
