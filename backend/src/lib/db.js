import mongoose from 'mongoose';
// mongoose for connecting to MongoDB
export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(error) {
        console.error('Error connecting to the database:', error);
    }
}