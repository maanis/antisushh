import { Navigate, Outlet } from "react-router-dom";

const ProtectedUpdateProfile = () => {
    const hasVisited = localStorage.getItem("hasVisitedUpdateProfile");

    if (hasVisited) {
        return <Navigate to="/feed" replace />; // Redirect to /feed instead of /dashboard
    }

    localStorage.setItem("hasVisitedUpdateProfile", "true"); // Mark as visited
    return <Outlet />; // Allow access for the first time
};

export default ProtectedUpdateProfile;
