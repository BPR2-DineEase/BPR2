import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRestaurant } from "@/services/restaurantService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CreateRestaurantDto } from "@/types/types.ts";
import {
  addRestaurantToUser,
  getDecodedToken,
  getUserById,
} from "@/api/authAPI";
import { extractClaim } from "@/context/AuthContext";

const CreateRestaurantForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateRestaurantDto>({
    name: "",
    address: "",
    city: "",
    openHours: "",
    cuisine: "",
    info: "",
    capacity: 0,
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [imageTypes, setImageTypes] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value, 10) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(files);
      setImageTypes(Array.from(files).map(() => "menu"));
    }
  };

  const handleTypeChange = (index: number, type: string) => {
    const updatedTypes = [...imageTypes];
    updatedTypes[index] = type;
    setImageTypes(updatedTypes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!images || images.length === 0) {
      setMessage("Please upload at least one image.");
      return;
    }

    try {
      const filesArray = Array.from(images);
      const createdRestaurant = await createRestaurant(
        formData,
        filesArray,
        imageTypes
      );
      if (!createdRestaurant) throw new Error("Restaurant creation failed.");

      const restaurantId = createdRestaurant.id;
      setMessage(`Restaurant created successfully with ID: ${restaurantId}`);

      const token = localStorage.getItem("jwt");
      if (!token) {
        setMessage("User authentication token not found.");
        return;
      }

      const decoded = getDecodedToken(token);
      const userId = extractClaim(decoded, "id");
      if (!userId) {
        setMessage("Failed to extract user ID.");
        return;
      }

      const user = await getUserById(userId);
      if (user?.id) {
        await addRestaurantToUser({ userId: user.id, restaurantId });
        setMessage("Restaurant added to user successfully!");
        navigate(`/restaurants/${restaurantId}`);
      } else {
        throw new Error("Failed to fetch user details.");
      }
    } catch (error: any) {
      setMessage(error.message || "Failed to process your request.");
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
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="Enter capacity"
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
            {images && (
              <div>
                {Array.from(images).map((file, index) => (
                  <div key={index} className="space-y-2">
                    <p>{file.name}</p>
                    <Label htmlFor={`imageType-${index}`}>Image Type</Label>
                    <select
                      id={`imageType-${index}`}
                      value={imageTypes[index]}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    >
                      <option value="menu">Menu</option>
                      <option value="photos">Photos</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
            <Button type="submit" className="w-full">
              Create Restaurant
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {message && (
            <div
              className={`text-sm mt-4 ${
                message.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateRestaurantForm;
