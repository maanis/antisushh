import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get("token"); // Get JWT from cookies
    const { user } = useSelector(state => state.userInfo);

    // Ensure user data is available before checking
    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (user && user.hasCompleteProfile === false) {
        return <Navigate to="/update-profile" replace />;
    }

    return children;
};

export default ProtectedRoute;
