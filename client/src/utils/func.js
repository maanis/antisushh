import { addOrRemoveSentReq, removePal } from "@/store/userSlice"
import apiClient from "./apiClient"
import { toast } from "sonner";

export const addPal = async (user, dispatch, setIsMenuOpen) => {
    try {
        const data = await apiClient(`/user/sendOrRemoveRequest`, "POST", { recieverId: user._id });
        if (data.success) {
            dispatch(addOrRemoveSentReq({ data: data.data, type: data.message }));
            toast.success(data.message);
            setIsMenuOpen(false);
            return data.message;
        } else {
            return data.message;
        }
    } catch (error) {
        console.log(error);
    }
};

export const handleUnpal = async (user, dispatch, setIsMenuOpen) => {
    try {
        const data = await apiClient(`/user/unfriend/${user._id}`, "POST");
        console.log(data)
        if (data.success) {
            dispatch(removePal(data.data));
            toast.success(data.message);
            if (setIsMenuOpen) setIsMenuOpen(false);
            return data.message;
        } else {
            return data.message;
        }
    } catch (error) {
        console.log(error);
    }
}
