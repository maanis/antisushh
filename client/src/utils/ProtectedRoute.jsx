import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get("token"); // Get JWT from cookies

    return token ? children : <Navigate to="/" />; // Redirect if no token
};

export default ProtectedRoute;
