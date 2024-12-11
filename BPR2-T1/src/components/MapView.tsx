import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Restaurant } from "../types/types";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
interface MapViewProps {
  restaurants: Restaurant[];
}

const MapView: React.FC<MapViewProps> = ({ restaurants }) => {
  const [center, setCenter] = useState<[number, number]>([
    56.162939, 10.203921,
  ]);

  const MapUpdater = () => {
    const map = useMap();
    React.useEffect(() => {
      map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
  };

  React.useEffect(() => {
    if (restaurants.length > 0) {
      if (restaurants[0].latitude && restaurants[0].longitude)
        setCenter([restaurants[0].latitude, restaurants[0].longitude]);
    }
  }, [restaurants]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-[calc(50vh)] w-full lg:h-[70vh]"
    >
      <MapUpdater />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={
            restaurant.latitude && restaurant.longitude
              ? [restaurant.latitude, restaurant.longitude]
              : [0, 0]
          }
          icon={customIcon}
        >
          <Popup>
            <h3 className="font-semibold">{restaurant.name}</h3>
            <p>{restaurant.address}</p>
            <p>{restaurant.cuisine}</p>
            <p>{restaurant.rating}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
