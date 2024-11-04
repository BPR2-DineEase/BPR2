import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import TableReservation from "./components/TableReservation";
import RestaurantSearch from "./components/RestaurantSearch";
import StartPage from "./components/StartPage";

const App: React.FC = () => {
    return (
        <Router>
            <div className="h-full w-full">
                <Routes>
                    {process.env.NODE_ENV === 'development' ? (
                        <Route path="/" element={<StartPage />} />
                    ) : (
                        <Route path="/" element={<Navigate to="/search" />} />
                    )}
                    <Route path="/search" element={<RestaurantSearch />} />
                    <Route path="/reservations" element={<TableReservation />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
