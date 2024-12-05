import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import {getDecodedToken, removeToken} from "@/services/jwtService.ts";


interface User {
    role: string;
    userId: string;
}

interface AuthContextType {
    auth: boolean;
    user: User | null;
    setAuth: (auth: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const extractClaim = (decoded: any, claimType: string): string => {
    const claimMapping: Record<string, string> = {
        role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
        name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
        email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
        id: "id",
    };

    const key = claimMapping[claimType];
    return key && decoded[key] ? decoded[key] : "";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuthState] = useState<boolean>(!!localStorage.getItem("jwt"));
    const [user, setUser] = useState<User | null>(null);

    const setAuth = (auth: boolean) => {
        setAuthState(auth);
        if (!auth) {
            setUser(null);
            removeToken();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            try {
                const decoded: any = getDecodedToken(token); 

                const user: User = {
                    role: extractClaim(decoded, "role"),
                    userId: extractClaim(decoded, "id"),
                };

                console.log("Decoded User:", user);
                setUser(user);
                setAuth(true);
            } catch (error) {
                console.error("Error decoding token:", error);
                setAuth(false);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, user, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;
