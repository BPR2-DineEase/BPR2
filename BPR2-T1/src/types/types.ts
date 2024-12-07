export type RestaurantData = {
    id: number;
    name: string;
    address: string;
    city: string;
    openHours: string;
    cuisine: string;
    info: string;
    capacity: number;
    images: {
        $id: string;
        $values: {
            id: string;
            uri: string;
            name: string | null;
            contentType: string | null;
            type: string | null;
        }[];
    };
    rating: number;
    latitude: number;
    longitude: number;
    imageUris: string[];
    reservations: any;
};

export type ReservationData = {
    id?: number;
    guestName: string;
    phoneNumber: string;
    email: string;
    company: string | null;
    comments: string;
    date: Date;
    time: string;
    numOfPeople: number;
    userId: string;
    restaurantId:number;
    restaurant?: RestaurantData;
};
export type ReservationPayload = Omit<ReservationData, "date"> & { date: string };

export enum UserRole {
    Customer = "Customer",
    RestaurantOwner = "RestaurantOwner",
}


export type Restaurant = {
    id: number;
    name: string;
    city: string;
    cuisine: string;
    rating?: number;
    latitude: number;
    longitude: number;
};

export type FilterOptions = {
    name?: string;
    cuisine?: string;
    rating?: number;
    stars?: number;
};

export interface CreateRestaurantDto {
    name: string;
    address: string;
    city: string;
    openHours: string;
    cuisine: string;
    info: string;
    capacity: number;
    latitude?: number;
    longitude?: number;
}