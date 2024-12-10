import React, { useEffect, useState } from "react";
import restaurantLogo from "../../public/restaurantLogo.png";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { RestaurantData } from "@/types/types";
import {
  deleteImageByImageId,
  fetchRestaurant,
  getImageByRestaurantIdAndType,
  updateRestaurant,
} from "@/api/restaurantApi";

import { Label } from "./ui/label";
import { Button } from "./ui/button";
import axiosInstance from "@/api/axiosInstance";

export const SettingsComponent: React.FC<{ restaurantId: number }> = ({
  restaurantId,
}) => {
  const [restaurant, setRestaurant] = useState<RestaurantData>({
    id: restaurantId,
    name: "",
    address: "",
    city: "",
    openHours: "",
    cuisine: "",
    rating: 0,
    info: "",
    capacity: 0,
    reservations: { $values: [] },
    latitude: 0,
    longitude: 0,
    imageUris: [],
    images: {
      $id: "",
      $values: [],
    },
  });

  const [availablePeople, setAvailablePeople] = useState<number>(0);
  const [openingHour, setOpeningHour] = useState("");
  const [closingHour, setClosingHour] = useState("");
  const [editRestaurant, setEditRestaurant] = useState<boolean>(true);
  const [editImages, setEditImages] = useState<boolean>(false);

  const [logo, setLogo] = useState<File>();
  const [logoUrl, setLogoUrl] = useState<string>(restaurantLogo);

  const [background, setBackground] = useState<File>();
  const [backgroundUrl, setBackgroundUrl] = useState<string>(restaurantLogo);

  const handleEditRestaurant = () => {
    setEditRestaurant(true);
    setEditImages(false);
  };

  const handleEditImages = () => {
    setEditRestaurant(false);
    setEditImages(true);
  };

  const extractImageId = (url: string) => {
    const regex = /1-([a-f0-9\-]{36})-logo/;
    const match = url.match(regex);
    if (match) {
      deleteImageByImageId(match[1]);
      return match[1];
    }
    return null;
  };

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantData = await fetchRestaurant(restaurantId);

        const imageUris =
          restaurantData.images?.$values?.map((img: any) => img.uri) || [];

        const imageLogoUri = await getImageByRestaurantIdAndType(
          restaurantId,
          "logo"
        );
        const imageBackgroundUri = await getImageByRestaurantIdAndType(
          restaurantId,
          "background"
        );

        if(imageUris)
        setLogoUrl(imageLogoUri.$values[0] || restaurantLogo);
        setBackgroundUrl(imageBackgroundUri.$values[0] || restaurantLogo);


        setRestaurant({
          ...restaurantData,
          imageUris,
          images: restaurantData.images || { $id: "", $values: [] },
        });

        const [startHour, endHour] = restaurantData.openHours.split(" - ");
        if (!startHour || !endHour) {
          console.error("Invalid openHours format");
          return;
        }
        setOpeningHour(startHour);
        setClosingHour(endHour);

        setAvailablePeople(restaurantData.capacity || 0);
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      }
    };

    fetchRestaurantData();
  }, [restaurantId, backgroundUrl]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogo(e.target.files[0]);
    }
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBackground(e.target.files[0]);
    }
  };

  const uploadImage = async (
    data: FormData,
    restaurantId: number,
    type: string
  ): Promise<any> => {
    try {
      const response = await axiosInstance.post(
        `/RestaurantCreation/uploadImage?restaurantId=${restaurantId}&type=${type}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.type == "logo") {
        setLogoUrl(response.data.uri);
      } else if (response.data.type == "background")
        setBackgroundUrl(response.data.uri);

      return response.data;
    } catch (err: any) {
      console.error("API Error: ", err);
      throw err;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (restaurant) {
      setRestaurant((prev) => ({
        ...prev,
        [name]: name === "rating" ? parseFloat(value) || 0 : value || "",
      }));
    }
  };

  const handleAvailablePeopleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAvailablePeople(parseInt(e.target.value, 10) || 0);
  };

  const handleOpeningHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpeningHour(formatTime(e.target.value));
  };

  const handleClosingHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClosingHour(formatTime(e.target.value));
  };

  const formatTime = (time: string): string => {
    return time.replace(":", ".").trim();
  };

  const handleSubmit = async () => {
    const updatedRestaurant: RestaurantData = {
      ...restaurant,
      capacity: availablePeople,
      openHours: `${openingHour} - ${closingHour}`,
    };

    try {
      await updateRestaurant(updatedRestaurant);
      alert("Restaurant updated successfully!");
    } catch (error: any) {
      console.error(
        "Failed to update restaurant:",
        error.response?.data || error.message
      );
      alert("Failed to update restaurant.");
    }
  };

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleImageError = (type: string) => {
    setImageErrors((prevErrors) => ({
      ...prevErrors,
      [type]: true,
    }));
  };


  return (
    <div>
      <div className="mb-20 w-full flex justify-center items-center space-x-12">
        <Button
          onClick={handleEditRestaurant}
          className="bg-blue-400 hover:bg-blue-300 w-50 text-lg h-14 text-black "
        >
          <h1>Edit Restaurant Info </h1>
        </Button>
        <Button
          onClick={handleEditImages}
          className="bg-blue-400 hover:bg-blue-300 w-50 text-lg h-14 text-black "
        >
          <h1>Edit Restaurant Images</h1>
        </Button>
      </div>
      {editRestaurant && (
        <div className="p-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Edit Restaurant Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    name="name"
                    value={restaurant?.name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={restaurant.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="cuisine">Cuisine</Label>
                  <Input
                    id="cuisine"
                    name="cuisine"
                    value={restaurant.cuisine}
                    onChange={handleInputChange}
                    placeholder="Cuisine"
                  />
                </div>
                <div>
                  <Label htmlFor="availablePeople">Available People</Label>
                  <Input
                    id="availablePeople"
                    type="number"
                    value={availablePeople}
                    onChange={handleAvailablePeopleChange}
                    placeholder="Available People"
                  />
                </div>
                <div>
                  <Label htmlFor="openingHour">Opening Hour</Label>
                  <Input
                    id="openingHour"
                    type="text"
                    value={openingHour}
                    onChange={handleOpeningHourChange}
                    placeholder="E.g. 10.00"
                  />
                </div>
                <div>
                  <Label htmlFor="closingHour">Closing Hour</Label>
                  <Input
                    id="closingHour"
                    type="text"
                    value={closingHour}
                    onChange={handleClosingHourChange}
                    placeholder="E.g. 21.00"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit}>Save</Button>
            </CardFooter>
          </Card>
        </div>
      )}
      {editImages && (
        <div className="w-full">
          <div className="flex justify-center items-center space-x-12 space-y-2 flex-wrap">
            <div>
              <Card className="max-w-md mx-auto mt-2 bg-blue-200 w-[500px] h-[500px] ">
                <CardHeader>
                  <CardTitle>Edit Logo</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center mt-4 max-w-[500px] max-h-[500px] ">
                  <div>
                    <img
                      src={imageErrors["logo"] ? restaurantLogo : logoUrl}
                      alt="Restaurant Logo"
                      onError={() => handleImageError("logo")}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 justify-end">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                  <Button onClick={() => extractImageId(logoUrl)}>
                    Delete
                  </Button>
                  <Button
                    onClick={() => {
                      if (logo) {
                        const formData = new FormData();
                        formData.append("file", logo);
                        uploadImage(formData, restaurantId, "logo");
                      }
                    }}
                  >
                    Upload
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div>
              <Card className="max-w-md mx-auto mt-2 bg-blue-200  w-[500px] h-[500px] ">
                <CardHeader>
                  <CardTitle>Edit Background Image</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center mt-4 max-w-[500px] max-h-[500px] ">
                  <div>
                    <img
                      src={
                        imageErrors["background"]
                          ? restaurantLogo
                          : backgroundUrl
                      }
                      alt="Restaurant Background Image"
                      onError={() => handleImageError("background")}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 justify-end">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundChange}
                  />
                  <Button onClick={() => extractImageId(logoUrl)}>
                    Delete
                  </Button>

                  <Button
                    onClick={() => {
                      if (background) {
                        const formData = new FormData();
                        formData.append("file", background);
                        uploadImage(formData, restaurantId, "background");
                      }
                    }}
                  >
                    Upload
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div>
              <Card className="mx-auto bg-blue-200 min-w-80 w-full h-80">
                <CardHeader>
                  <CardTitle>Edit Menu Images</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center gap-2 mt-6">
                  <div>
                    <img src={restaurantLogo} />
                  </div>
                  <div>
                    <img src={restaurantLogo} />
                  </div>
                  <div>
                    <img src={restaurantLogo} />
                  </div>
                  <div>
                    <img src={restaurantLogo} />
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </div>
          </div>
          <div className="flex justify-center w-full mt-12">
            <div className="w-full">
              <Card className="max-w-4xl w-full mx-auto bg-blue-200 h-[640px] ">
                <CardHeader>
                  <CardTitle>Edit Restaurant Images</CardTitle>
                </CardHeader>
                <div className="flex-row flex flex-wrap h-140 w-140 gap-2 ">
                  <CardContent>
                    <div>
                      <img src={restaurantLogo} alt="Restaurant Logo" />
                    </div>
                  </CardContent>
                  <CardContent>
                    <div>
                      <img src={restaurantLogo} alt="Restaurant Logo" />
                    </div>
                  </CardContent>
                  <CardContent>
                    <div>
                      <img src={restaurantLogo} alt="Restaurant Logo" />
                    </div>
                  </CardContent>
                  <CardContent>
                    <div>
                      <img src={restaurantLogo} alt="Restaurant Logo" />
                    </div>
                  </CardContent>
                  <CardContent>
                    <div>
                      <img src={restaurantLogo} alt="Restaurant Logo" />
                    </div>
                  </CardContent>
                </div>
                <CardFooter></CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
