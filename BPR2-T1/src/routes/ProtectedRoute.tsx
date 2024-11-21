import {useAuth} from "@/context/AuthContext.tsx";
import {Navigate} from "react-router-dom";


const ProtectedRoute = ({ children, roles }: { children: JSX.Element; roles?: string[] }) => {
    const { auth, user } = useAuth();

    if (!auth) {
        console.warn("User not authenticated, redirecting to login.");
        return <Navigate to="/login" />;
    }

    if (roles) {
        if (!user || !user.role) {
            console.warn("User data or role is missing, redirecting to unauthorized.");
            return <Navigate to="/unauthorized" />;
        }

        const isAuthorized = roles.some((role) => role.toLowerCase() === user.role.toLowerCase());
        console.log(`Role Check: User role '${user.role}' vs Allowed roles '${roles}' - Access: ${isAuthorized}`);

        if (!isAuthorized) {
            console.warn(`Unauthorized: User role '${user.role}' not in required roles '${roles}'.`);
            return <Navigate to="/unauthorized" />;
        }
    }

    return children;
};

export default ProtectedRoute;