import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedUpdateProfile = () => {
    const { user } = useSelector(state => state.userInfo);

    if (!user) {
        return <p>Loading...</p>; // Prevent accessing undefined properties
    }
    if (user.hasCompleteProfile === true) {
        return <Navigate to="/feed" replace />;
    }

    return <Outlet />;
};

export default ProtectedUpdateProfile;
