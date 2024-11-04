import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; 

const StartPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Development Start Page</h1>
            <p className="mb-4 text-lg text-gray-600">Choose a feature to test:</p>
            <div className="space-y-3">
                <Link to="/search">
                    <Button variant="default" className="w-full max-w-xs">
                        Go to Search Page
                    </Button>
                </Link>
                <Link to="/reservations">
                    <Button variant="secondary" className="w-full max-w-xs">
                        Go to Reservation Page
                    </Button>
                </Link>
                {/* Add more buttons here for additional features */}
            </div>
        </div>
    );
};

export default StartPage;
