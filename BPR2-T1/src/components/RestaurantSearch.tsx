import React, { useState } from "react";
import { Restaurant } from "../api/restaurantApi";
import CitySearch from "./CitySearch";
import FilterOptionsComponent from "./FilterOptionsComponent";

const RestaurantSearch: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [city, setCity] = useState<string>("");
    const [hasSearched, setHasSearched] = useState<boolean>(false); 

    const handleSearchResults = (data: Restaurant[]) => {
        console.log("Setting restaurants from search:", data);
        setRestaurants(data);
        setHasSearched(true); 
        if (data.length > 0) {
            setCity(data[0].city);
        }
    };

    const handleFilterResults = (data: Restaurant[]) => {
        console.log("Filter Results:", data);
        setRestaurants(data);
        setHasSearched(true);
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <h2 className="text-xl font-semibold">Search and Filter Restaurants</h2>

            <CitySearch onSearch={handleSearchResults} />
            <FilterOptionsComponent onFilter={handleFilterResults} city={city} />

            {restaurants.length > 0 ? (
                <ul className="mt-4 space-y-2 w-full max-w-md">
                    {restaurants.map((restaurant) => (
                        <li key={restaurant.id} className="p-2 border-b border-gray-200">
                            <h3 className="font-semibold">{restaurant.name}</h3>
                            <p>{restaurant.city} - {restaurant.cuisine}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                hasSearched && ( 
                    <p className="text-gray-500 mt-4">No restaurants found.</p>
                )
            )}
        </div>
    );
};

export default RestaurantSearch;
