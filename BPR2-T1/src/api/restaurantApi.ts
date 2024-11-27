import axiosInstance from "@/api/axiosInstance";

export type Restaurant = {
    id: number;
    name: string;
    city: string;
    cuisine: string;
    latitude: number;
    longitude: number;
};

export type FilterOptions = {
    name?: string;
    cuisine?: string;
    rating?: number;
    stars?: number;
};

export const searchRestaurants = async (city: string): Promise<Restaurant[]> => {
    try {
        const response = await axiosInstance.get(`/Restaurants/search`, {
            params: { city },
        });
        console.log("API Response:", response.data);
        const restaurants = response.data?.$values || [];
        return restaurants;
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
};
export const filterRestaurants = async (options: FilterOptions): Promise<Restaurant[]> => {
    try {
        const response = await axiosInstance.get(`/Restaurants/filter`, {
            params: options,
        });
        console.log("API Response:", response.data);
        const restaurants = response.data?.$values || [];
        return restaurants;
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
};