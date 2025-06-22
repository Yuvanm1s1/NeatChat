// const express = require("express");
//above type is commonjs
// import express from "express"; // this is ES6 module syntax type is "module"
import express from "express";
import dotenv from "dotenv"; 
import authRoutes from "./routes/auth.route.js"; // Importing the auth routes, make sure to put .js as type is module
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"; // Importing cookie-parser to handle cookies and grab values out of it
import messageRoutes from "./routes/message.route.js"; // Importing message routes, make sure to put .js as type is module
import cors from "cors"; 
const app= express();
app.use(express.json()); // to get values from the body of the request
app.use(cookieParser()); // to parse cookies from the request headers
app.use(cors({
    origin: "http://localhost:5173", // Allow requests from this origin which is the frontend
    credentials: true, // Allow cookies to be sent with requests
}));
dotenv.config()
const PORT = process.env.PORT || 5001;
//.use() is a method to mount middleware functions
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)
app.listen(PORT,()=>{
    console.log("Server is running on port "+ PORT);
    connectDB()
})