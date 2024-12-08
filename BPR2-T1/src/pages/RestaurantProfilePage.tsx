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
        <Card className="max-w-4xl mx-auto mt-8 shadow-lg">
            <CardHeader>
                <CardTitle className="text-3xl">{restaurant.name}</CardTitle>
                <p className="text-gray-600">{restaurant.city}</p>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">Cuisine</h3>
                    <p className="text-gray-700">
                        {restaurant.cuisine || "Cuisine information not available"}
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Rating</h3>
                    <p className="text-gray-700">
                        {restaurant.review?.rating || "Rating information not available"}
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Stars</h3>
                    <p className="text-gray-700">
                        {restaurant.review?.stars || "Stars information not available"}
                    </p>
                </div>
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
                    {hasImages ? (
                        <div className="relative w-full overflow-hidden rounded-lg">
                            <AspectRatio ratio={16 / 9}>
                                <img
                                    src={images[currentSlide]?.uri}
                                    alt={images[currentSlide]?.name || "Restaurant Image"}
                                    className="object-contain w-full h-full"
                                />
                            </AspectRatio>
                            <button
                                onClick={handlePrev}
                                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                            >
                                &lt;
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                            >
                                &gt;
                            </button>
                        </div>
                    ) : (
                        <div className="rounded-lg overflow-hidden shadow-sm">
                            <AspectRatio ratio={16 / 9}>
                                <img
                                    src="https://via.placeholder.com/300?text=No+Image+Available"
                                    alt="No images available"
                                    className="object-contain w-full h-full"
                                />
                            </AspectRatio>
                        </div>
                    )}
                </div>
            </CardContent>
            <Separator/>
            <CardFooter className="text-center">
                <Link
                    to={`/reservations?restaurantId=${restaurant.id}`}
                    className="inline-block px-6 py-2 text-white bg-black rounded-md hover:bg-gray-800 transition duration-300"
                >
                    Reserve your table now!
                </Link>
            </CardFooter>
        </Card>
    );
};

export default RestaurantProfile;
