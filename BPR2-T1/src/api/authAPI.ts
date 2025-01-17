import { jwtDecode } from "jwt-decode";
import axiosInstance from "./axiosInstance";
import {UserData} from "@/types/types.ts";

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/Auth/login", credentials);

    if (typeof response.data === "string") {
      return response.data;
    }

    if (response.data?.token) {
      return response.data.token;
    }

    throw new Error("Unexpected response structure");
  } catch (error: any) {
    console.error("Login API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/Auth/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch user by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Unable to fetch user details"
    );
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const encodedEmail = encodeURIComponent(email);
    const response = await axiosInstance.get(
      `/Auth/user-email/${encodedEmail}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch user by email",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Unable to fetch user details"
    );
  }
};

export const getDecodedToken = (token: string) => {
  try {
    return jwtDecode<{
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
    }>(token);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

export const registerUser = async (details: {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}) => {
  try {
    console.log("Registering user with details:", details);
    const response = await axiosInstance.post("/Auth/register", details);
    console.log("Registration API response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Registration API error:",
      error.response?.data || error.message
    );
    if (error.response?.data?.errors) {
      console.error("Validation errors:", error.response.data.errors);
    }
    throw error;
  }
};

export const addRestaurantToUser = async (data: {
  userId: string;
  restaurantId: number;
}) => {
  try {
    const res = await axiosInstance.post(
      `/Auth/addRestaurantToUser?userId=${data.userId}&restaurantId=${data.restaurantId}`,
      data
    );
    console.log("Response ", res);
    return res.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const generateResetOtp = async (email: string) => {
  try {
    const response = await axiosInstance.post(
      "/Auth/generate-reset-otp",
      email
    );
    return response.data;
  } catch (error: any) {
    console.error("Generate Reset Otp Error Response:", error.response);
    throw new Error(
      error.response?.data?.message || "Failed to generate reset Otp"
    );
  }
};

export const resetPassword = async (resetDetails: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  try {
    const response = await axiosInstance.post(
      "/Auth/reset-password",
      resetDetails
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Reset Password Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to reset password"
    );
  }
};


export const updateUserProfile = async (userId: string, data: UserData): Promise<void> => {
  try {
    const response = await axiosInstance.put(`/Auth/${userId}/update`, data);
    console.log("User Profile Update Response:", response.data);
  } catch (err: any) {
    if (err.isAxiosError) {
      console.error("Axios error during profile update:", err.response?.data);
    } else {
      console.error("Unexpected error during profile update:", err);
    }
    throw err;
  }
};