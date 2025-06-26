import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js"
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

// export const sendMessages = async(req,res)=>{
//     console.log("sendMessages called");
//     try{
//         const senderId = req.user._id;
//         const {id:userToChatId} = req.params;
//         const {text, image} = req.body;
//         let imageUrl;
//         if (image) {
//         // Upload base64 image to cloudinary
//         const uploadResponse = await cloudinary.uploader.upload(image);
//         imageUrl = uploadResponse.secure_url;
//         }
//         const newMessage = new Message({
//             senderId:senderId,
//             receiverId:userToChatId,
//             text: text || "",
//             image: imageUrl || ""
//         })
//         if(!newMessage){
//             return res.status(400).json({ message: "Message creation failed" });
//         }
//         await newMessage.save();

//         //todo: realtime functionality goes here =>socket.io
//         res.status(200).json(newMessage);
//     }catch(error){
//         console.error("Error in sendMessages:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }


import axios from "axios";
import { getReceiverSocketId,io } from "../lib/socket.js";
export const sendMessages = async (req, res) => {
    console.log("sendMessages called");
    try {
        const senderId = req.user._id;
        const { id: userToChatId } = req.params;
        const { text, image } = req.body;

        let moderatedText = text || "";
        let moderatedImageBase64 = null;
        let imageUrl = "";

        // 📝 Step 1: Moderate text
        if (text && text.trim()) {
            try {
                const textRes = await axios.post("http://localhost:8000/moderate-text", { text });
                moderatedText = textRes.data.moderated_text;
            } catch (err) {
                console.error("Text moderation failed, using original text", err.message);
            }
        }

        // 📝 Step 2: Moderate image
        if (image) {
            try {
                const imgRes = await axios.post("http://localhost:8000/moderate-image", { image });
                moderatedImageBase64 = imgRes.data.blurred_image_base64;
            } catch (err) {
                console.error("Image moderation failed, skipping image", err.message);
            }
        }

        // 📝 Step 3: Upload moderated image to Cloudinary
        if (moderatedImageBase64) {
            const uploadRes = await cloudinary.uploader.upload(`data:image/png;base64,${moderatedImageBase64}`);
            imageUrl = uploadRes.secure_url;
        }

        // 📝 Step 4: Create and save message
        const newMessage = new Message({
            senderId,
            receiverId: userToChatId,
            text: moderatedText,
            image: imageUrl
        });

        if (!newMessage) {
            return res.status(400).json({ message: "Message creation failed" });
        }

        await newMessage.save();
        const recieverSocketId = getReceiverSocketId(userToChatId);
        if(recieverSocketId){
            //io.emit broadcasts
            io.to(recieverSocketId).emit("newMessage",newMessage);
        }
        res.status(200).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};