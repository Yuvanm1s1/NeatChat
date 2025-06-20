import Message from "../models/message.model.js";
import User from "../models/user.model.js";

//fetch every single user except us
export const getUsersForSidebar= async(req,res)=>{
    console.log("getUsersForSidebar called");
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    }catch(error){
        console.error("Error in getUsersForSidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const getMessages = async(req, res) => {
    try{
        //id--> userToChatId rename
        const {id:userToChatId} = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:senderId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:senderId}
            ]
        })
        res.status(200).json(messages);
    }catch(error){
        console.error("Error in getMessages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessages = async(req,res)=>{
    console.log("sendMessages called");
    try{
        const senderId = req.user._id;
        const {id:userToChatId} = req.params;
        const {text, image} = req.body;
        let imageUrl;
        if (image) {
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId:senderId,
            receiverId:userToChatId,
            text: text || "",
            image: imageUrl || ""
        })
        if(!newMessage){
            return res.status(400).json({ message: "Message creation failed" });
        }
        await newMessage.save();

        //todo: realtime functionality goes here =>socket.io
        res.status(200).json(newMessage);
    }catch(error){
        console.error("Error in sendMessages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}