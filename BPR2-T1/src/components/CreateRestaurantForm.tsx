import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRestaurant } from "@/services/restaurantService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const CreateRestaurantForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        openHours: "",
        cuisine: "",
        info: "",
    });
    const [images, setImages] = useState<FileList | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!images || images.length === 0) {
            setMessage("Please upload at least one image.");
            return;
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        Array.from(images).forEach((file) => {
            data.append("files", file);
        });

        try {
            const createdRestaurant = await createRestaurant(data);
            setMessage(`Restaurant created successfully with ID: ${createdRestaurant.id}`);
            navigate("/"); 
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Failed to create restaurant.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle>Create Restaurant</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Restaurant Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter restaurant name"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter address"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="Enter city"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="openHours">Open Hours</Label>
                            <Input
                                id="openHours"
                                name="openHours"
                                value={formData.openHours}
                                onChange={handleInputChange}
                                placeholder="Enter open hours"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="cuisine">Cuisine</Label>
                            <Input
                                id="cuisine"
                                name="cuisine"
                                value={formData.cuisine}
                                onChange={handleInputChange}
                                placeholder="Enter cuisine"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="info">Additional Info</Label>
                            <textarea
                                id="info"
                                name="info"
                                value={formData.info}
                                onChange={handleInputChange}
                                placeholder="Enter additional info"
                                className="border border-gray-300 rounded-md p-2 w-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="images">Images</Label>
                            <Input
                                id="images"
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="file-input file-input-bordered w-full"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Create Restaurant
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    {message && (
                        <div className={`text-sm mt-4 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                            {message}
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default CreateRestaurantForm;
