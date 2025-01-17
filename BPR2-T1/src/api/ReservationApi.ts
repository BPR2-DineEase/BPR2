import axiosInstance from "@/api/axiosInstance.ts";
import {ReservationData, ReservationPayload} from "@/types/types.ts";


export const postReservation = async (data: ReservationData): Promise<void> => {
  try {
    const response = await axiosInstance.post(`/reservations/create`, data);
    console.log("Response: ", response.data);
  } catch (err: any) {
    if (err.isAxiosError(err)) console.error("Axios error", err.response?.data);
    else console.error("Unexpected error: ", err);
    throw err;
  }
};

export const fetchUserReservations = async (userId: string): Promise<ReservationData[]> => {
  try {
    const response = await axiosInstance.get(`/reservations/${userId}/reservations`);
    console.log("API Response:", response.data); 

    if (response.data?.$values) {
      return response.data.$values;
    }

    console.error("Unexpected API response structure:", response.data);
    return [];
  } catch (err: any) {
    console.error("Failed to fetch reservations:", err);
    return [];
  }
};

export const updateReservation = async (reservationId: string, data: ReservationPayload): Promise<void> => {
  try {
    const response = await axiosInstance.put(`/reservations/${reservationId}/update`, data);
    console.log("Update Response:", response.data);
  } catch (err: any) {
    if (err.isAxiosError) {
      console.error("Axios error during update:", err.response?.data);
    } else {
      console.error("Unexpected error during update:", err);
    }
    throw err;
  }
};

export const cancelReservation = async (reservationId: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/reservations/${reservationId}/cancel`);
    console.log("Cancel Response:", response.data);
  } catch (err: any) {
    if (err.isAxiosError) {
      console.error("Axios error during cancel:", err.response?.data);
    } else {
      console.error("Unexpected error during cancel:", err);
    }
    throw err;
  }
};