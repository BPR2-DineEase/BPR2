import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RestaurantSearch from "./components/RestaurantSearch";
import TableReservation from "./components/TableReservation";
import ProtectedRoute from "./routes/ProtectedRoute";


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/search"
                    element={
                        <ProtectedRoute roles={["Customer", "RestaurantOwner"]}>
                            <RestaurantSearch />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reservations"
                    element={
                        <ProtectedRoute roles={["Customer"]}>
                            <TableReservation />
                        </ProtectedRoute>
                    }
                />
                
                <Route path="/unauthorized" element={<div>You are not authorized to view this page.</div>} />
            </Routes>
        </Router>
    );
};

export default App;
