// api/user.ts
import api from "./api";

export const getProfile = () => api.get("/me");

export const updateProfile = (payload: {
    name: string;
    email: string;
    phone: string;
    password?: string;
}) => api.put("/user/profile", payload);
