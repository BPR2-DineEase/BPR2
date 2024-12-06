import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRestaurantById } from "@/services/restaurantService";
import { RestaurantData } from "@/types/types";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Separator} from "@radix-ui/react-select";
import {AspectRatio} from "@/components/ui/aspect-ratio.tsx";

const RestaurantProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
    useEffect(() => {
        if (id) {
            fetchRestaurantById(parseInt(id, 10))
                .then((data) => setRestaurant(data)) 
                .catch((error) => {
                    console.error("Error fetching restaurant:", error);
                });
        }
    }, [id]);

    if (!restaurant) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
                <span className="ml-3 text-lg">Loading...</span>
            </div>
        );
    }

    return (
        <Card className="max-w-4xl mx-auto mt-8 shadow-lg">
            <CardHeader>
                <CardTitle className="text-3xl">{restaurant.name}</CardTitle>
                <p className="text-gray-600">{restaurant.city}</p>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">Address</h3>
                    <p className="text-gray-700">{restaurant.address}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Open Hours</h3>
                    <p className="text-gray-700">{restaurant.openHours}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Images</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {restaurant.images && restaurant.images.$values && restaurant.images.$values.length > 0 ? (
                            restaurant.images.$values.map((image: {
                                id: string;
                                uri: string;
                                name: string | null
                            }, index: number) => (
                                <div key={image.id || index} className="rounded-lg overflow-hidden shadow-sm">
                                    <AspectRatio ratio={16 / 9}>
                                        <img
                                            src={image.uri}
                                            alt={image.name || "Restaurant Image"}
                                            className="object-cover w-full h-full"
                                        />
                                    </AspectRatio>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-lg overflow-hidden shadow-sm">
                                <AspectRatio ratio={16 / 9}>
                                    <img
                                        src="https://via.placeholder.com/300?text=No+Image+Available"
                                        alt="No images available"
                                        className="object-cover w-full h-full"
                                    />
                                </AspectRatio>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <Separator/>
            <CardFooter>
                <p className="text-gray-500">Visit us for a great experience!</p>
            </CardFooter>
        </Card>
    );
};

export default RestaurantProfile;
