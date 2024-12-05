import axiosInstance from "@/api/axiosInstance";

export type Restaurant = {
  id: number;
  name: string;
  city: string;
  cuisine: string;
  rating: number;
  latitude: number;
  longitude: number;
  capacity: number;
  openHours: string;
  imageUris: [];
  reservations: any;
};


export type FilterOptions = {
    name?: string;
    cuisine?: string;
    rating?: number;
    stars?: number;
};

export interface CreateRestaurantDto {
    name: string;
    address: string;
    city: string;
    openHours: string;
    cuisine: string;
    info: string;
    latitude?: number;
    longitude?: number;
}

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

export const restaurantCreate = async (data: FormData): Promise<any> => {
    try {
        const response = await axiosInstance.post(`/RestaurantCreation`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const getRestaurantById = async (id: number): Promise<Restaurant> => {
  try {
    
    const response = await axiosInstance.get(`/RestaurantCreation/${id}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

export const updateRestaurant = async (data: Restaurant): Promise<any> => {
  try {
    const response = await axiosInstance.put(
      `/RestaurantCreation/${data.id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};




