import {Restaurant, FilterOptions, filterRestaurants, searchRestaurants} from "../api/restaurantApi";

export const searchRestaurantsByCity = async (city: string): Promise<Restaurant[]> => {
    if (!city) {
        throw new Error("City name is required to perform a search.");
    }

    try {
        const data = await searchRestaurants(city);
        return data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to search restaurants.");
    }
};

export const filterRestaurantsByOptions = async (options: FilterOptions): Promise<Restaurant[]> => {
    try {
        const data = await filterRestaurants(options);
        return data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to filter restaurants.");
    }
};
