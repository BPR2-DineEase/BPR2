import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRestaurantById } from "@/services/restaurantService";
import { RestaurantData } from "@/types/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const RestaurantProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

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

    const images = restaurant.images?.$values || [];
    const hasImages = images.length > 0;

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Card className="w-11/12 max-w-2xl mx-auto mt-16 shadow-md rounded-lg">
            <CardHeader className="p-4 border-b">
                <CardTitle className="text-2xl font-semibold text-gray-800">{restaurant.name}</CardTitle>
                <p className="text-gray-500 text-sm">{restaurant.city}</p>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 space-y-4">
                <div>
                    <h3 className="text-base font-medium text-gray-800">Cuisine</h3>
                    <p className="text-gray-700 text-sm">
                        {restaurant.cuisine || "Cuisine information not available"}
                    </p>
                </div>
                <div>
                    <h3 className="text-base font-medium text-gray-800">Rating</h3>
                    <p className="text-gray-700 text-sm">
                        {restaurant.review?.rating || "Rating information not available"}
                    </p>
                </div>
                <div>
                    <h3 className="text-base font-medium text-gray-800">Stars</h3>
                    <p className="flex space-x-1 text-sm">
                        {restaurant.review?.stars !== undefined
                            ? Array.from({ length: 5 }, (_, i) => (
                                <span
                                    key={i}
                                    className={`text-lg ${
                                        i < (restaurant.review?.stars || 0)
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                    }`}
                                >
                    ★
                  </span>
                            ))
                            : "Stars information not available"}
                    </p>
                </div>
                <div>
                    <h3 className="text-base font-medium text-gray-800">Address</h3>
                    <p className="text-gray-700 text-sm">{restaurant.address}</p>
                </div>
                <div>
                    <h3 className="text-base font-medium text-gray-800">Open Hours</h3>
                    <p className="text-gray-700 text-sm">{restaurant.openHours}</p>
                </div>
                <div>
                    <h3 className="text-base font-medium text-gray-800">Images</h3>
                    {hasImages ? (
                        <div className="relative w-full rounded-lg overflow-hidden">
                            <AspectRatio ratio={16 / 9}>
                                <img
                                    src={images[currentSlide]?.uri}
                                    alt={images[currentSlide]?.name || "Restaurant Image"}
                                    className="object-contain w-full h-full rounded-lg"
                                />
                            </AspectRatio>
                            <button
                                onClick={handlePrev}
                                className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
                                aria-label="Previous image"
                            >
                                &lt;
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
                                aria-label="Next image"
                            >
                                &gt;
                            </button>
                        </div>
                    ) : (
                        <div className="w-full rounded-lg overflow-hidden shadow-sm">
                            <AspectRatio ratio={16 / 9}>
                                <img
                                    src="https://via.placeholder.com/300?text=No+Image+Available"
                                    alt="No images available"
                                    className="object-contain w-full h-full rounded-lg"
                                />
                            </AspectRatio>
                        </div>
                    )}
                </div>
            </CardContent>
            <Separator />
            <CardFooter className="p-4 text-center">
                <Link
                    to={`/reservations?restaurantId=${restaurant.id}`}
                    className="inline-block px-6 py-2 text-sm text-white bg-black rounded-md hover:bg-gray-800 transition duration-300"
                >
                    Reserve your table now!
                </Link>
            </CardFooter>
        </Card>
    );
};

export default RestaurantProfile;
