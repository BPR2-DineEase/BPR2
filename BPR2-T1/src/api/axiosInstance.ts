import axios from "axios";

const primaryBaseURL = "https://dineease.azurewebsites.net/api";
const secondaryBaseURL = "https://localhost:7203/api";

const axiosInstance = axios.create({
    baseURL: primaryBaseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.config && error.code === "ECONNABORTED") {
            if (error.config.baseURL === primaryBaseURL) {
                error.config.baseURL = secondaryBaseURL;
                return axios(error.config);
            }
        } else if (error.config && !error.response) {
            if (error.config.baseURL === primaryBaseURL) {
                error.config.baseURL = secondaryBaseURL;
                return axios(error.config);
            }
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;
    