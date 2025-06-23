import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
export const useAuthStore= create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth:true,
    onlineUsers: [],
    checkAuth: async()=>{
        try{
            const res = await axiosInstance.get("/auth/check") //localhost:5001 /api already established in instance
            set({
                authUser: res.data
            })
        }catch(err){
            console.error("Error checking authentication:", err);
            set({
                authUser: null
            });
        }finally {
            set({
                isCheckingAuth: false
            });
        }
    },
    signup: async(formdata)=>{
        set({
            isSigningUp: true
        })
        try{
            const res = await axiosInstance.post("/auth/signup", formdata);
            toast.success("Account created successfully!");
            set({
                authUser: res.data
            });
        
        }catch(err){
            toast.error("Error signing up. Please try again"+err.response?.data?.message || "Unknown error");
            console.error("Error signing up:", err);
            // Handle error, e.g., show a notification or set an error state
        }finally {
            set({
                isSigningUp: false
            })
        }
    },
    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({
                authUser: null
            });
            toast.success("Logged out successfully!");
        }catch(err){
            console.error("Error logging out:", err);
            toast.error("Error logging out. Please try again."+ err.response?.data?.message || "Unknown error");
        }
    },
    login:async(formdata)=>{
        set({
            isLoggingIn: true
        })
        try{
            const res = await axiosInstance.post("/auth/login", formdata);
            set({
                authUser: res.data
            });
            toast.success("Logged in successfully!");
        }catch(error){
            console.error("Error logging in:", error);
            toast.error("Error logging in. Please try again."+ error.response?.data?.message || "Unknown error");
        }finally{
            set({
                isLoggingIn: false
            });
        }
    },
    updateProfile:async(data)=>{
        set({isUpdatingProfile: true})
        try{
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({
                authUser: res.data
            });
        }catch(error){
            console.error("Error updating profile:", error);
            toast.error("Error updating profile. Please try again."+ error.response?.data?.message || "Unknown error");
        }finally{
            set({isUpdatingProfile: false})
        }
    }
}))