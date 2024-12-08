import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Restaurant } from "../types/types";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});
interface MapViewProps {
    restaurants: Restaurant[];
}

const MapView: React.FC<MapViewProps> = ({ restaurants }) => {
    const [center, setCenter] = useState<[number, number]>([56.162939, 10.203921]);

    const MapUpdater = () => {
        const map = useMap();
        React.useEffect(() => {
            map.setView(center, map.getZoom());
        }, [center, map]);
        return null;
    };

    React.useEffect(() => {
        if (restaurants.length > 0) {
            setCenter([restaurants[0].latitude, restaurants[0].longitude]);
        }
    }, [restaurants]);

    return (
        <MapContainer center={center} zoom={13} style={{ height: "500px", width: "100%" }}>
            <MapUpdater />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {restaurants.map((restaurant) => (
                <Marker
                    key={restaurant.id}
                    position={[restaurant.latitude, restaurant.longitude]}
                >
                    <Popup>
                        <h3>{restaurant.name}</h3>
                        <p>{restaurant.city}</p>
                        <p>{restaurant.cuisine}</p>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;
