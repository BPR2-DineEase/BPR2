import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authAPI";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("Sending login request with credentials:", { email, password });

           
            const token = await loginUser({ email, password });
            console.log("Login API response (token):", token); 

            if (!token) {
                throw new Error("No token received from server.");
            }

            
            localStorage.setItem("jwt", token);
            console.log("Token saved to localStorage:", localStorage.getItem("jwt")); 

           
            setAuth(true);
            console.log("Auth state updated to true"); 

            
            navigate("/");
            console.log("Navigating to home page"); 
        } catch (error: any) {
            console.error("Login failed:", error?.response || error.message || error);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
