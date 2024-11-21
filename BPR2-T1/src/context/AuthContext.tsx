import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";


interface User {
    role: string;
}

interface AuthContextType {
    auth: boolean;
    user: User | null;
    setAuth: (auth: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const extractClaim = (decoded: any, claimType: string): string => {
    const key = Object.keys(decoded).find(k => k.includes(claimType));
    return key ? decoded[key] : "";
};
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuthState] = useState<boolean>(!!localStorage.getItem("jwt"));
    const [user, setUser] = useState<User | null>(null);

    const setAuth = (auth: boolean) => {
        setAuthState(auth);
        if (!auth) {
            setUser(null);
            localStorage.removeItem("jwt");
        }
    };
    
   
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);

                const user: User = {
                    role: extractClaim(decoded, "role"),
                };

                console.log("Decoded User Role:", user.role); // Debug role
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
