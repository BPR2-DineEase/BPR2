import React, { useState } from "react";
import { AuthService } from "../services/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {useNavigate} from "react-router-dom";

const RequestResetOtp: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(""); 
        setError("");

        try {
            
            await AuthService.generateResetOtp(email);

            
            setMessage(
                "A password reset link has been sent to your email address. Redirecting..."
            );
            
            setTimeout(() => {
                navigate("/reset-password");
            }, 2000);
        } catch (error: any) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="relative mb-6 w-80 text-center">
                <img
                    src="/DineEaseLogo.png"
                    alt="Logo"
                    className="w-full h-auto rounded-lg"
                />
            </div>
            <form onSubmit={handleRequest} className="space-y-4 p-6 bg-white rounded shadow-md w-96">
                <h1 className="text-xl font-semibold text-center">Request Password Reset</h1>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full mt-1"
                    />
                </div>
                <Button type="submit" className="w-full">
                    Request Reset Otp
                </Button>
                {message && <p className="text-green-500 text-center mt-4">{message}</p>}
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </form>
        </div>
    );
};

export default RequestResetOtp;