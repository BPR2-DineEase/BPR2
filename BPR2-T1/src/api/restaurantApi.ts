import axios from "axios";

const API_BASE_URL = "http://localhost:5109";

export type Restaurant = {
    id: number;
    name: string;
    city: string;
    cuisine: string;
    
};

export type FilterOptions = {
    name?: string;
    cuisine?: string;
    city?: string;
    rating?: number;
    stars?: number;
};

export const filterRestaurants = async (options: FilterOptions): Promise<Restaurant[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Restaurant/filter`, {
            params: options,
        });
        return response.data;
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            console.error("Axios error", err.response?.data);
        } else {
            console.error("Unexpected error: ", err);
        }
        throw err;
    }
};
