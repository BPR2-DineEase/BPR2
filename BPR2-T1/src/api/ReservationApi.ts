import axiosInstance from "@/api/axiosInstance.ts";


export type ReservationData = {
  date: Date;
  time: string;
  numOfPeople: number;
  guestName: string;
  phoneNumber: string;
  comments: string;
  company: string;
  email: string;
  userId: string;
  restaurantId: number;
};

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
