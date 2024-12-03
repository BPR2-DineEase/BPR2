import {loginUser, registerUser, generateResetOtp, resetPassword } from "../api/authAPI";

export class AuthService {
    static async login(email: string, password: string): Promise<string> {
        return await loginUser({ email, password });
    }

    static async register(details: {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
    }): Promise<any> {
        return await registerUser(details);
    }

    static async generateResetOtp(email: string): Promise<any> {
        return await generateResetOtp(email);
    }

    static async resetPassword(resetDetails: { email: string; otp: string; newPassword: string }): Promise<any> {
        return await resetPassword(resetDetails);
    }
}