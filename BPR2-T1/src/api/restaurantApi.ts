import axios from "axios";

const API_BASE_URL = "http://localhost:5109";

export type Restaurant = {
    id: number;
    name: string;
    city: string;
    
};

export const fetchRestaurantsByCity = async (city: string): Promise<Restaurant[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Restaurant/search`, {
            params: { city },
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
