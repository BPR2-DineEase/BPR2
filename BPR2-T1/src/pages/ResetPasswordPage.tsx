import React, { useState } from "react";
import { AuthService } from "../services/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ResetPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(""); 
        setError("");

        try {
            
            await AuthService.resetPassword({ email, otp, newPassword });
            
            setMessage("Your password has been reset successfully. You can now log in with your new password.");
        } catch (error: any) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleReset} className="space-y-4 p-6 bg-white rounded shadow-md w-96">
                <h1 className="text-xl font-semibold text-center">Reset Password</h1>
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
                <div>
                    <Label htmlFor="otp">Reset Otp</Label>
                    <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter the reset token"
                        required
                        className="w-full mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        required
                        className="w-full mt-1"
                    />
                </div>
                <Button type="submit" className="w-full">
                    Reset Password
                </Button>
                {message && <p className="text-green-500 text-center mt-4">{message}</p>}
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;