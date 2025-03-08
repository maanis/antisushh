import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedUpdateProfile = () => {
    const { user } = useSelector(state => state.userInfo);

    if (!user) {
        return <p>Loading...</p>; // Prevent accessing undefined properties
    }
    console.log(user.hasCompleteProfile)
    if (user.hasCompleteProfile === true) {
        return <Navigate to="/feed" replace />;
    }

    return <Outlet />;
};

export default ProtectedUpdateProfile;
