/*import React, { useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { Restaurant } from "../api/restaurantApi";

const containerStyle = {
    width: "100%",
    height: "500px",
};

interface GoogleMapComponentProps {
    restaurants: Restaurant[];
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ restaurants }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    });

    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

    const defaultCenter = restaurants.length
        ? { lat: restaurants[0].latitude, lng: restaurants[0].longitude }
        : { lat: 56.162939, lng: 10.203921 }; 

    if (!isLoaded) return <div>Loading map...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={13}
        >
            {restaurants.map((restaurant) => (
                <Marker
                    key={restaurant.id}
                    position={{
                        lat: restaurant.latitude,
                        lng: restaurant.longitude,
                    }}
                    onClick={() => setSelectedRestaurant(restaurant)}
                />
            ))}
            {selectedRestaurant && (
                <InfoWindow
                    position={{
                        lat: selectedRestaurant.latitude,
                        lng: selectedRestaurant.longitude,
                    }}
                    onCloseClick={() => setSelectedRestaurant(null)}
                >
                    <div>
                        <h3>{selectedRestaurant.name}</h3>
                        <p>{selectedRestaurant.cuisine}</p>
                        <p>{selectedRestaurant.city}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default GoogleMapComponent;
*/