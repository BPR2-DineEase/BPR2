import { UserData } from "@/types/types.ts";
import React, {useState} from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";
import { updateUserProfile} from "@/api/authAPI.ts";
import {useAuth} from "@/context/AuthContext.tsx";

const UserEditForm: React.FC = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData>({
        Email: "",
        Password: "",
        FirstName: "",
        LastName: "",
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!user?.userId) {
            alert("Unable to identify user. Please log in again.");
            return;
        }

        const payload = {
            id: user.userId, 
            Email: userData.Email,
            Password: userData.Password,
            FirstName: userData.FirstName,
            LastName: userData.LastName,
        };

        try {
            console.log("Payload sent to API:", payload);
            await updateUserProfile(user.userId, payload); 
            alert("User updated successfully!");
        } catch (error: any) {
            console.error("Failed to update user:", error);
            if (error.response?.data) {
                alert(`Error: ${error.response.data}`);
            } else {
                alert("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="p-6">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Edit User Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="Email"
                                type="email"
                                value={userData.Email}
                                onChange={handleInputChange} 
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="Password"
                                type="password"
                                value={userData.Password}
                                onChange={handleInputChange}
                                placeholder="Enter a new password"
                            />
                        </div>
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="FirstName"
                                value={userData.FirstName}
                                onChange={handleInputChange}
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="LastName"
                                value={userData.LastName}
                                onChange={handleInputChange}
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit}>Save</Button>
                </CardFooter>
            </Card>
        </div>
    );
};
export default UserEditForm;
