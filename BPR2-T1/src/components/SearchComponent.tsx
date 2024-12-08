import React from "react";
import { useNavigate } from "react-router-dom";
import {Restaurant} from "@/types/types.ts";
import CitySearch from "@/pages/CitySearchPage.tsx";

const SearchComponent: React.FC = () => {
    const navigate = useNavigate();

    const handleSearch = (restaurants: Restaurant[]) => {
        if (restaurants.length > 0) {
            navigate("/results", { state: { restaurants } });
        } else {
            alert("No restaurants found for the selected city!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-6">Find Your Favorite Restaurants</h1>
            <CitySearch onSearch={handleSearch} />
        </div>
    );
};

export default SearchComponent;
