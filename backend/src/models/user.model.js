import mongoose from "mongoose";
//new mongoose.Schema({})
const userSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,    
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePic:{
            type: String,
            default: ""
        }
    },
    {
        timestamps: true, //to show me,ber since etc
        }
);
const User = mongoose.model("User", userSchema); //in this case User is the name of the collection in MongoDB
export default User; 