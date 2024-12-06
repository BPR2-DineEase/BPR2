import axiosInstance from "@/api/axiosInstance";
import {FilterOptions, Restaurant, RestaurantData } from "@/types/types";


export const searchRestaurants = async (city: string): Promise<Restaurant[]> => {
    try {
        const { data } = await axiosInstance.get(`/Restaurants/search`, { params: { city } });
        console.log("API Response:", data);
        return data?.$values || [];
    } catch (err) {
        console.error("API Error in searchRestaurants:", err);
        throw err;
    }
};

export const filterRestaurants = async (options: FilterOptions): Promise<Restaurant[]> => {
    try {
        const { data } = await axiosInstance.get(`/Restaurants/filter`, { params: options });
        console.log("API Response:", data);
        return data?.$values || [];
    } catch (err) {
        console.error("API Error in filterRestaurants:", err);
        throw err;
    }
};

export const restaurantCreate = async (data: FormData): Promise<any> => {
    try {
        const { data: responseData } = await axiosInstance.post(`/RestaurantCreation`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return responseData;
    } catch (error) {
        console.error("API Error in restaurantCreate:", error);
        throw error;
    }
};

export const fetchRestaurant = async (id: number): Promise<RestaurantData> => {
    try {
        const { data } = await axiosInstance.get(`/RestaurantCreation/${id}`);
        console.log("API Response:", data);
        return data || {};
    } catch (err) {
        console.error("API Error in fetchRestaurant:", err);
        throw err;
    }
};