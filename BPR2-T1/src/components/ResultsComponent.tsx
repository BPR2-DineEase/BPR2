import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FilterOptionsComponent from "../components/FilterOptionsComponent";
import MapView from "../components/MapView";
import {Restaurant} from "@/api/restaurantApi.ts";

const ResultsComponent: React.FC = () => {
    const location = useLocation();
    const restaurants = location.state.restaurants || []; 
    const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurants);

    const handleFilterResults = (data: Restaurant[]) => {
        setFilteredRestaurants(data);
    };

    return (
        <div className="flex">
          
            <div className="w-1/4 p-4 border-r">
                <FilterOptionsComponent
                    onFilter={handleFilterResults}
                    city={restaurants[0]?.city || ""}
                />
            </div>

        
            <div className="w-3/4 p-4">
                <h2 className="text-xl font-semibold mb-4">Restaurants in {restaurants[0]?.city}</h2>
                <div className="flex flex-col space-y-4">
                    {/* Restaurant List */}
                    <ul>
                        {filteredRestaurants.map((restaurant) => (
                            <li key={restaurant.id} className="p-2 border-b">
                                <h3 className="font-semibold">{restaurant.name}</h3>
                                <p>{restaurant.cuisine} - {restaurant.rating} stars</p>
                            </li>
                        ))}
                    </ul>
                </div>

               
                <div className="mt-6">
                    <h3 className="text-lg font-medium">Map View</h3>
                    <MapView restaurants={filteredRestaurants} />
                </div>
            </div>
        </div>
    );
};

export default ResultsComponent;
