import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authAPI";
import { v4 as uuidv4 } from "uuid"; 

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

        const newErrors: string[] = [];
        if (!email.includes("@")) newErrors.push("Invalid email format.");
        if (password.length < 6) newErrors.push("Password must be at least 6 characters long.");
        if (!firstName.trim()) newErrors.push("First name is required.");
        if (!lastName.trim()) newErrors.push("Last name is required.");
        if (!["Customer", "RestaurantOwner"].includes(role)) newErrors.push("Invalid role selected.");

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await registerUser({ id, email, password, firstName, lastName, role });
            alert("Registration successful. Please log in.");
            navigate("/login");
        } catch (error: any) {
            console.error("Registration failed:", error);

            if (error.response?.data?.errors) {
                const backendErrors = Object.values(error.response.data.errors).flat() as string[];
                setErrors(backendErrors);
            } else {
                setErrors(["An unexpected error occurred. Please try again."]);
            }
        }
    };
    return (
        <form onSubmit={handleRegister}>
            <h1>Register</h1>
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
            <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
            />
            <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Customer">Customer</option>
                <option value="RestaurantOwner">Restaurant Owner</option>
            </select>
            <button type="submit">Register</button>

            {errors.length > 0 && (
                <div>
                    <h2>Validation Errors:</h2>
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    );
};

export default Register;