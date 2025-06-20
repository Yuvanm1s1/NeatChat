//creating the cloudinary instance to upload images to cloudinary
import {v2 as cloudinary} from 'cloudinary';
import {config} from 'dotenv';
config();//to access environment variables from .env file
//cloudinary. config is used to configure the cloudinary instance with your cloud name, api key and api secret
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
export default cloudinary; 