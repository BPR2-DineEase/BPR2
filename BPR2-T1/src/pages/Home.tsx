import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Home: React.FC = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth(false); 
        navigate("/login"); 
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Development Home Page</h1>
            <p className="mb-4 text-lg text-gray-600">Choose a feature to test:</p>
            <div className="space-y-3">
                <Link to="/search">
                    <Button variant="default" className="w-full max">
                        Go to Search Page
                    </Button>
                </Link>
                <Link to="/reservations">
                    <Button variant="secondary" className="w-full max">
                        Go to Reservation Page
                    </Button>
                </Link>
                <Link to="/create-restaurant">
                    <Button variant="secondary" className="w-full max">
                        Go to Restaurant Creation Page
                    </Button>
                </Link>
            </div>
            <div className="mt-6">
                <Button
                    variant="destructive"
                    className="w-full max-w-xs"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Home;
