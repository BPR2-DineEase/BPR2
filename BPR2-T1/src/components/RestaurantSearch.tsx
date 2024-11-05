import React, { useState } from "react";
import { filterRestaurants, Restaurant, FilterOptions } from "../api/restaurantApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";

const RestaurantSearch: React.FC = () => {
    const [city, setCity] = useState<string>("");
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        try {
            setError(null);
            const data = await filterRestaurants({ ...filterOptions, city });
            setRestaurants(data);
        } catch (error: any) {
            setError(error.message || "An error occurred while fetching restaurants.");
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <h2 className="text-xl font-semibold">Search and Filter Restaurants</h2>

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

            <div className="w-full max-w-md grid grid-cols-1 gap-4 mt-4">
                <Input
                    placeholder="Restaurant Name"
                    value={filterOptions.name || ""}
                    onChange={(e) => setFilterOptions((prev) => ({ ...prev, name: e.target.value }))}
                />
                <Input
                    placeholder="Cuisine Type"
                    value={filterOptions.cuisine || ""}
                    onChange={(e) => setFilterOptions((prev) => ({ ...prev, cuisine: e.target.value }))}
                />
                <Input
                    type="number"
                    placeholder="Minimum Rating"
                    value={filterOptions.rating?.toString() || ""}
                    onChange={(e) => setFilterOptions((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                />
                <Input
                    type="number"
                    placeholder="Minimum Stars"
                    value={filterOptions.stars?.toString() || ""}
                    onChange={(e) => setFilterOptions((prev) => ({ ...prev, stars: Number(e.target.value) }))}
                />
            </div>

            <Button onClick={handleSearch} className="mt-4">
                Apply Filters
            </Button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <ul className="mt-4 space-y-2 w-full max-w-md">
                {restaurants.map((restaurant) => (
                    <li key={restaurant.id} className="p-2 border-b border-gray-200">
                        <h3 className="font-semibold">{restaurant.name}</h3>
                        <p>{restaurant.city} - {restaurant.cuisine}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RestaurantSearch;