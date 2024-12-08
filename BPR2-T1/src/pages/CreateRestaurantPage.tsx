import CreateRestaurantForm from "@/components/CreateRestaurantForm";

const CreateRestaurant = () => {
    return (
        <div className="container mx-auto py-12 bg-gray-50 min-h-screen">
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-center text-gray-800">
                    Create Your Restaurant
                </h1>
            </header>
            <div className="flex justify-center">
                <CreateRestaurantForm />
            </div>
        </div>
    );
};

export default CreateRestaurant;