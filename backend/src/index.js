// const express = require("express");
//above type is commonjs
// import express from "express"; // this is ES6 module syntax type is "module"
import express from "express";
import dotenv from "dotenv"; 
import authRoutes from "./routes/auth.route.js"; // Importing the auth routes, make sure to put .js as type is module
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"; // Importing cookie-parser to handle cookies and grab values out of it
const app= express();
app.use(express.json()); // to get values from the body of the request
app.use(cookieParser()); // to parse cookies from the request headers
dotenv.config()
const PORT = process.env.PORT || 5001;
//.use() is a method to mount middleware functions
app.use("/api/auth",authRoutes)
app.listen(PORT,()=>{
    console.log("Server is running on port "+ PORT);
    connectDB()
})