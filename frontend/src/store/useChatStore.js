import {create} from "zustand"
import toast from "react-hot-toast"
import {axiosInstance} from "../lib/axios"
export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers:async()=>{
        set({isUsersLoading:true})
        try{
            const res = await axiosInstance.get("/messages/users");
            set({users:res.data})
        }catch(error){
            toast.error("Failed to fetch users"+error);
        }finally{set({isUsersLoading:false})}
    },

    getMessages :async(userId)=>{
        set({
            isMessagesLoading:true
        })
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({
                messages:res.data
            })
        }catch(err){toast.error("Error in fetching the messages")}finally{set({isMessagesLoading:false})}

    },
    sendMessage:async(messageData)=>{
        //destructure the state above
        const {selectedUser,messages} = get()
        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
            set({
                messages:[...messages,res.data]
            })

        }catch(err)
        {toast.error(err)}
    },
    //todo:optimize this one later
    setSelectedUser:(selectedUser)=>set({selectedUser})
}))