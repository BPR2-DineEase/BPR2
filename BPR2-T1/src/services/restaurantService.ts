import {
  CreateRestaurantDto,
  FilterOptions,
  Restaurant,
  RestaurantData,
} from "@/types/types.ts";
import {
  fetchRestaurant,
  filterRestaurants,
  restaurantCreate,
  searchRestaurants,
} from "@/api/restaurantApi.ts";

export const searchRestaurantsByCity = async (
  city: string
): Promise<Restaurant[]> => {
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

export const filterRestaurantsByOptions = async (
  options: FilterOptions
): Promise<Restaurant[]> => {
  try {
    const data = await filterRestaurants(options);
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to filter restaurants.");
  }
};

export const createRestaurant = async (
  dto: CreateRestaurantDto,
  files: File[],
  imageTypes: string[]
): Promise<any> => {
  const formData = new FormData();
  Object.entries(dto).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });

  files.forEach((file) => formData.append("files", file));
  imageTypes.forEach((type) => formData.append("imageTypes", type));

  try {
    return await restaurantCreate(formData);
  } catch (error: any) {
    throw new Error(error.message || "Failed to create restaurant.");
  }
};

export const fetchRestaurantById = async (
  id: number
): Promise<RestaurantData> => {
  if (!id) {
    throw new Error("Restaurant ID is required to fetch the restaurant.");
  }

  try {
    const data = await fetchRestaurant(id);
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch restaurant details.");
  }
};
