import { Navigate, Outlet } from "react-router-dom";

const ProtectedUpdateProfile = () => {
    const isProfileComplete = localStorage.getItem("isProfileComplete") === "true";
    const hasVisited = localStorage.getItem("hasVisitedUpdateProfile") === "true";

    if (isProfileComplete || hasVisited) {
        return <Navigate to="/feed" replace />; // Redirect if profile is completed or already visited
    }

    localStorage.setItem("hasVisitedUpdateProfile", "true"); // Mark as visited
    return <Outlet />; // Allow access
};

export default ProtectedUpdateProfile;