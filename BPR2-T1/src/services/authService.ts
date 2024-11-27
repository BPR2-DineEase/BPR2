import { loginUser, registerUser } from "../api/authAPI";

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
}
