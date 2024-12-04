import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TableReservation from "./components/TableReservation";
import ProtectedRoute from "./routes/ProtectedRoute";
import SearchComponent from "@/components/SearchComponent.tsx";
import ResultsComponent from "@/components/ResultsComponent.tsx";
import CreateRestaurant from "@/pages/CreateRestaurant.tsx";
import ResetPassword from "@/pages/ResetPassword";
import RequestResetOtp from "@/pages/ResetOtp";
import OwnerDashboard from "./pages/OwnerDashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-restaurant" element={<CreateRestaurant />} />
        <Route path="/request-reset-otp" element={<RequestResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<OwnerDashboard />} />
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
              <SearchComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute roles={["Customer", "RestaurantOwner"]}>
              <ResultsComponent />
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

        <Route
          path="/unauthorized"
          element={<div>You are not authorized to view this page.</div>}
        />
      </Routes>
    </Router>
  );
};

export default App;
