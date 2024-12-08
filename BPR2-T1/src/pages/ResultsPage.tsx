import React, { useState } from "react";
import {Link, useLocation} from "react-router-dom";
import FilterOptionsComponent from "../components/FilterOptionsComponent";
import MapView from "../components/MapView";
import {Restaurant} from "@/types/types.ts";
import {toast} from "@/hooks/use-toast.ts";


const ResultsComponent: React.FC = () => {
    const location = useLocation();
    const restaurants = location.state.restaurants || [];
    const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurants);

    const handleFilterResults = (data: Restaurant[]) => {
        setFilteredRestaurants(data);

        
        toast({
            title: "Filter Applied",
            description: `Showing ${data.length} restaurants matching the criteria.`,
            duration: 3000,
        });
    };

    return (
        <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/4 w-full border-r p-4">
                <FilterOptionsComponent
                    onFilter={handleFilterResults}
                    city={restaurants[0]?.city || ""}
                />
            </div>
            <div className="lg:w-3/4 w-full p-4">
                <h2 className="text-xl font-semibold mb-4">
                    Restaurants in {restaurants[0]?.city}
                </h2>
                <div className="space-y-4">
                    <ul className="divide-y">
                        {filteredRestaurants.map((restaurant) => (
                            <li key={restaurant.id} className="py-4">
                                <h3 className="font-medium">{restaurant.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {restaurant.cuisine} - {restaurant.rating} stars
                                </p>
                                <Link
                                    to={`/restaurants/${restaurant.id}`}
                                    className="text-primary hover:underline"
                                >
                                    View Restaurant Profile
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Map View</h3>
                    <MapView restaurants={filteredRestaurants}/>
                </div>
            </div>
        </div>
    );
};

export default ResultsComponent;