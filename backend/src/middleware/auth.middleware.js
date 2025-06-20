import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
//check for cookie in req-->verify cookie for decoded token-->extract userId and find user(without password)-->attach the user to req.user-->next()

export const protectRoute = async (req, res, next) => {
    try{

        const token=req.cookies.jwt; //"jwt" is the name of the cookie where the token is stored
        if(!token)
        return res.status(401).json({
            message: "Unauthorized, no token provided"
        });
        //if token is present, then decode it to access the user_id from it -->decoded.userId
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        //find the user using the userId from the decoded token
        const user = await User.findById(decoded.userId).select("-password")//Exclude password from the user object
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        req.user = user; // Attach the user object to the request
        next(); // Call the next middleware or route handler
    }
    catch(error){
        console.error("Error in protectRoute middleware:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }

}