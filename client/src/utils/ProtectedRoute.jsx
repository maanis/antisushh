import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get("token"); // Check JWT token
    const isProfileComplete = Cookies.get("isProfileComplete") === "true"; // Check profile completion

    if (!token) return <Navigate to="/" />; // Redirect to login if no token
    if (!isProfileComplete) return <Navigate to="/update-profile" />; // Redirect to update profile if incomplete

    return children; // Allow access
};

export default ProtectedRoute;
