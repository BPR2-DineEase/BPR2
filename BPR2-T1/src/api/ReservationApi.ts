import axios from "axios";

const API_BASE_URL = "http://localhost:5173";

export type ReservationData = {
  date: Date;
  time: string;
  numOfPeople: number;
  name: string;
  phoneNumber: number;
  comment: string;
  company: string;
  email: string;
};

export const postReservation = async (data: ReservationData): Promise<void> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/reservations`, data);
    console.log("Response: ", response.data);
  } catch (err: any) {
    if (err.isAxiosError(err)) console.error("Axios error", err.response?.data);
    else console.error("Unexpected error: ", err);
    throw err;
  }
};
