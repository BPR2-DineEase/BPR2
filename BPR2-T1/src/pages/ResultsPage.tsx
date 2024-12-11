import React, { useState } from "react";
import {Link, useLocation} from "react-router-dom";
import FilterOptionsComponent from "../components/FilterOptionsComponent";
import MapView from "../components/MapView";
import {Restaurant} from "@/types/types.ts";
import {useToast} from "@/hooks/use-toast.ts";
import {ToastProvider} from "@radix-ui/react-toast";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";

const ResultsComponent: React.FC = () => {
    const location = useLocation();
    const restaurants = location.state?.restaurants || [];
    const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurants);
    const [isMapVisible, setIsMapVisible] = useState(false);

    const { toast } = useToast();

    const handleFilterResults = (data: Restaurant[]) => {
        setFilteredRestaurants(data);

        toast({
            title: "Filter Applied",
            description: `Showing ${data.length} restaurants matching the criteria.`,
            duration: 3000,
        });
    };

    return (
        <ToastProvider>
            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="lg:w-1/3 w-full border-r p-4 bg-background shadow-md flex flex-col gap-6">
                    <section aria-labelledby="filter-options-title">
                        <h2 id="filter-options-title" className="text-lg font-bold mb-4">
                            Filter Options
                        </h2>
                        <FilterOptionsComponent
                            onFilter={handleFilterResults}
                            city={restaurants[0]?.city || ""}
                        />
                    </section>

                    <section aria-labelledby="map-title">
                        <h2 id="map-title" className="text-lg font-bold mb-4">
                            Map
                        </h2>
                        <div>
                            <button
                                onClick={() => setIsMapVisible(!isMapVisible)}
                                className={`w-full px-4 py-2 rounded-md shadow ${
                                    isMapVisible
                                        ? "bg-gray-300 text-black hover:bg-gray-400"
                                        : "bg-black text-white hover:bg-gray-800"
                                } transition-colors duration-200`}
                            >
                                {isMapVisible ? "Hide Map" : "Show Map"}
                            </button>
                        </div>
                        {isMapVisible && (
                            <div className="mt-4">
                                <MapView restaurants={filteredRestaurants} />
                            </div>
                        )}
                    </section>
                </aside>
                
                <main className="lg:w-2/3 w-full p-4">
                    <header>
                        <h2 className="text-2xl font-semibold mb-6">
                            Restaurants in {restaurants[0]?.city || "Unknown City"}
                        </h2>
                    </header>

                    {filteredRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredRestaurants.map((restaurant) => (
                                <Card
                                    key={restaurant.id}
                                    className="hover:shadow-lg transition-shadow duration-300"
                                >
                                    <CardHeader>
                                        <CardTitle>{restaurant.name}</CardTitle>
                                        <CardDescription>{restaurant.cuisine}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Link
                                            to={`/restaurants/${restaurant.id}`}
                                            className="text-primary hover:underline"
                                        >
                                            View Restaurant Profile
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No restaurants match your filters. Try adjusting the options.</p>
                    )}
                </main>
            </div>
        </ToastProvider>
    );
};

export default ResultsComponent;
