import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import TableReservation from "./components/TableReservation";
import ProtectedRoute from "./routes/ProtectedRoute";
import SearchComponent from "@/components/SearchComponent.tsx";
import ResultsComponent from "@/pages/ResultsPage";
import CreateRestaurant from "@/pages/CreateRestaurantPage";
import ResetPassword from "@/pages/ResetPasswordPage";
import RequestResetOtp from "@/pages/ResetOtpPage";
import OwnerDashboard from "./pages/OwnerDashboardPage";
import { Toaster } from "@/components/ui/toaster.tsx";
import RestaurantProfile from "@/pages/RestaurantProfilePage";
import { useAuth } from "./context/AuthContext";
import CustomerDashboardPage from "./pages/CustomerDashboardPage";

const App: React.FC = () => {
  const { user } = useAuth();
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-restaurant" element={<CreateRestaurant />} />
          <Route path="/request-reset-otp" element={<RequestResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/restaurants/:id" element={<RestaurantProfile />} />
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
            path="/dashboard"
            element={
              <ProtectedRoute roles={["Customer", "RestaurantOwner"]}>
                {user?.role === "Customer" ? (
                  <CustomerDashboardPage />
                ) : (
                  <OwnerDashboard />
                )}
              </ProtectedRoute>
            }
          />

          <Route
            path="/unauthorized"
            element={<div>You are not authorized to view this page.</div>}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
