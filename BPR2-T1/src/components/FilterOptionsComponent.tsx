import React, { useState } from "react";
import { Restaurant, FilterOptions } from "../api/restaurantApi";
import { filterRestaurantsByOptions } from "../services/restaurantService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FilterOptionsComponent: React.FC<{
    onFilter: (restaurants: Restaurant[]) => void;
    city?: string;
}> = ({ onFilter, city }) => {
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
    const [error, setError] = useState<string | null>(null);

    const applyFilters = async () => {
        try {
            setError(null);
            const options = { ...filterOptions, ...(city ? { city } : {}) };
            const data = await filterRestaurantsByOptions(options);
            onFilter(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="w-full max-w-md mt-6">
            <h3 className="text-lg font-medium">Filter Options</h3>
            <div className="grid grid-cols-1 gap-4 mt-2">
                <Input
                    placeholder="Restaurant Name"
                    value={filterOptions.name || ""}
                    onChange={(e) => setFilterOptions((prev) => ({ ...prev, name: e.target.value }))}
                />
                <Input
                    placeholder="Cuisine Type"
                    value={filterOptions.cuisine || ""}
                    onChange={(e) => setFilterOptions((prev) => ({ ...prev, cuisine: e.target.value }))}
                />
                <Input
                    type="number"
                    placeholder="Minimum Rating"
                    value={filterOptions.rating?.toString() || ""}
                    onChange={(e) => setFilterOptions((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                />
                <Input
                    type="number"
                    placeholder="Minimum Stars"
                    value={filterOptions.stars?.toString() || ""}
                    onChange={(e) => setFilterOptions((prev) => ({ ...prev, stars: Number(e.target.value) }))}
                />
            </div>
            <Button onClick={applyFilters} className="mt-4">
                Apply Filters
            </Button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default FilterOptionsComponent;
