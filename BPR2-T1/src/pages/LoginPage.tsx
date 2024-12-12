import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
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
import { saveToken } from "@/services/jwtService.ts";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth  } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await AuthService.login(email, password);

      saveToken(token);
      setAuth(true);
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleForgotPassword = () => {
    navigate("/request-reset-otp");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="relative mb-6 w-80 text-center">
        <img
          src="/DineEaseLogo.png"
          alt="Logo"
          className="w-full h-auto rounded-lg"
        />
      </div>
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="text-right mt-4">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-500 hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
