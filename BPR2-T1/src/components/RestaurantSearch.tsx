import React, { useState } from "react";
import { fetchRestaurantsByCity, Restaurant } from "../api/restaurantApi";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command"; 

const RestaurantSearch: React.FC = () => {
    const [city, setCity] = useState<string>("");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        try {
            setError(null);
            const data = await fetchRestaurantsByCity(city);
            setRestaurants(data);
        } catch (error: any) {
            setError(error.message || "An error occurred while fetching restaurants.");
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <Command className="w-full max-w-md">
                <CommandInput
                    placeholder="Search for a city..."
                    value={city}
                    onValueChange={(value) => setCity(value)}
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandItem onSelect={(value) => { setCity(value); handleSearch(); }}>
                        {city}
                    </CommandItem>
                </CommandList>
            </Command>

            {error && <p className="text-red-500">{error}</p>}

            <ul className="mt-4 space-y-2">
                {restaurants.map((restaurant) => (
                    <li key={restaurant.id} className="p-2 border-b border-gray-200">
                        {restaurant.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RestaurantSearch;
