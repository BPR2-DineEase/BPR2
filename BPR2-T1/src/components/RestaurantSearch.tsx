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

    const handleCitySearch = async () => {
        try {
            setError(null);
            const data = await filterRestaurants({ city });
            setRestaurants(data);
        } catch (error: any) {
            setError(error.message || "An error occurred while fetching restaurants.");
        }
    };

    const applyFilters = async () => {
        try {
            setError(null);
            const data = await filterRestaurants({ ...filterOptions, city });
            setRestaurants(data);
        } catch (error: any) {
            setError(error.message || "An error occurred while applying filters.");
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <h2 className="text-xl font-semibold">Search and Filter Restaurants</h2>

            {/* City Search Section */}
            <div className="w-full max-w-md">
                <h3 className="text-lg font-medium">Search by City</h3>
                <Command className="w-full">
                    <CommandInput
                        placeholder="Enter a city..."
                        value={city}
                        onValueChange={(value) => setCity(value)}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandItem onSelect={(value) => { setCity(value); handleCitySearch(); }}>
                            {city}
                        </CommandItem>
                    </CommandList>
                </Command>
                <Button onClick={handleCitySearch} className="mt-2">
                    Search by City
                </Button>
            </div>

            {/* Filter Options Section */}
            <div className="w-full max-w-md mt-6">
                <h3 className="text-lg font-medium">Filter Options</h3>
                <div className="grid grid-cols-1 gap-4 mt-2">
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
                <Button onClick={applyFilters} className="mt-4">
                    Apply Filters
                </Button>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {/* Restaurant List */}
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
