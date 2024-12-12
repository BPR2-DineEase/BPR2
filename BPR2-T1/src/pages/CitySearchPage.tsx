import React, { useState } from "react";
import { searchRestaurantsByCity } from "../services/restaurantService";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types/types.ts";

const CitySearch: React.FC<{
  onSearch: (restaurants: Restaurant[]) => void;
}> = ({ onSearch }) => {
  const [city, setCity] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleCitySearch = async () => {
    try {
      setError(null);
      const data = await searchRestaurantsByCity(city);
      onSearch(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col justify-center  items-center">
        <h3 className="text-lg font-medium">Search by City</h3>
        <Command className="w-full max-w-72">
          <CommandInput
            placeholder="Enter a city..."
            value={city}
            onValueChange={(value) => setCity(value)}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandItem
              onSelect={(value) => {
                setCity(value);
                handleCitySearch();
              }}
            >
              {city}
            </CommandItem>
          </CommandList>
        </Command>
        <Button onClick={handleCitySearch} className="mt-2 max-w-32">
          Search by City
        </Button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default CitySearch;
