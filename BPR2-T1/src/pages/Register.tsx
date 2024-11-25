import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { v4 as uuidv4 } from "uuid";
import { validateRegistrationInputs } from "../utils/validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("Customer");
    const [errors, setErrors] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        const id = uuidv4();

        const validationErrors = validateRegistrationInputs({ email, password, firstName, lastName, role });
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await AuthService.register({ id, email, password, firstName, lastName, role });
            alert("Registration successful. Please log in.");
            navigate("/login");
        } catch (error: any) {
            setErrors([error.message]);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-96 shadow-lg">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your first name"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter your last name"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 w-full"
                            >
                                <option value="Customer">Customer</option>
                                <option value="RestaurantOwner">Restaurant Owner</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    {errors.length > 0 && (
                        <div>
                            <h2 className="text-red-500 text-sm">Validation Errors:</h2>
                            <ul className="list-disc list-inside text-red-500">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;
