import axiosInstance from "./axiosInstance";

export const loginUser = async (credentials: { email: string; password: string }) => {
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
        console.error("Registration API error:", error.response?.data || error.message);
        if (error.response?.data?.errors) {
            console.error("Validation errors:", error.response.data.errors);
        }
        throw error;
    }
};


export const generateResetOtp = async (email: string) => {
    try {
        const response = await axiosInstance.post("/Auth/generate-reset-otp", email);
        return response.data;
    } catch (error: any) {
        console.error("Generate Reset Otp Error Response:", error.response);
        throw new Error(error.response?.data?.message || "Failed to generate reset Otp");
    }
};

export const resetPassword = async (resetDetails: { email: string; otp: string; newPassword: string }) => {
    try {
        const response = await axiosInstance.post("/Auth/reset-password", resetDetails);
        return response.data;
    } catch (error: any) {
        console.error("Reset Password Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to reset password");
    }
};