import { jwtDecode } from "jwt-decode";

export const getDecodedToken = (token: string) => {
    return jwtDecode(token);
};

export const saveToken = (token: string) => {
    localStorage.setItem("jwt", token);
};

export const removeToken = () => {
    localStorage.removeItem("jwt");
};
