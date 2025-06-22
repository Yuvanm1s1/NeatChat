import axios from 'axios';
//create an axios instance with a base URL and credentials
export const axiosInstance = axios.create({
    baseURL:"http://localhost:5001/api",
    withCredentials: true,// This allows cookies to be sent with requests
});