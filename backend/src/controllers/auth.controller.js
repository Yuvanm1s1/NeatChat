import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"; 
//hash password--> bcrypt.genSalt and bcrypt.hash-->create new user-->generateToken-->save to db-->res.status
export const signup = async(req, res) => {
  const{fullName, email, password} = req.body;
  try{
   
   if(!fullName || !email || !password){
    return res.status(400).json({
      message: "Please fill all the fields"
    });
  }
   if (password.length < 6){
    res.status(400).json({
      message: "Password must be at least 6 characters long"
    });
  }
    const user = await User.findOne({email: email});
    if (user) {
      return res.status(400).json({
        message: "User already exists"
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //creating the new user object
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });
    if(newUser){
      // This cookie gets sent to the browser, so on future requests the browser will automatically include the cookie, allowing your server to authenticate the user.
      generateToken(newUser._id, res);
      await newUser.save();
      //returning the user data in the response
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
      })
        
   }else{
    res.status(500).json({
      message: "Error creating user"
    });
   }
  }catch(error){
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
  
}

//extract the payload-->check for email--> chk for password using bcrypt.compare-->generate token-->send response
export const login = async (req, res) => {
  const { email, password } = req.body
  try{
    const user = await User.findOne({ email: email });
    if(!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password)
    if(!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }
    generateToken(user._id, res);
    //user data to be sent in the response
    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  }catch(error){
    console.error("Error during login:", error);
  }
}
//set the cookie to expire immediately, effectively logging the user out and value to an empty string
export const logout = (req, res) => {
  try{
    res.cookie("jwt", "", {
      maxAge:0 // Set the cookie to expire immediately
    });
    res.status(200).json({
      message: "Logout successful"
    });
  }catch(error){
    console.error("Error during logout:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}


//extract profile pic-->extract userId from req.user (from protectRoute middleware)-->check if profilePic is present-->upload to cloudinary using cloudinary.uploader.upload()-->update user profilePic in db with the URL from Cloudinary
export const updateProfile = async (req, res) => {
  try{
    const {profilePic}=req.body;
    const userId = req.user._id;//from protect route
    if(!profilePic){
      return res.status(400).json({
        message: "Please provide a profile picture"
      });
    }
    // Upload the profile picture to Cloudinary: uploader.upload() and for getting the image we use uploadResult.secure_url
    const uploadResult = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {profilePic: uploadResult.secure_url }, // Update the profilePic field with the URL from Cloudinary
      { new: true } // Return the updated user document if not used then returns the original document before update
    )
    res.status(200).json(updatedUser)


  }catch(err){
    console.error("Error during updateProfile:", err);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

//we will be calling this function when the page loads to check if the user is authenticated and returns the user
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}