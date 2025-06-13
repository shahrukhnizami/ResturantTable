import mongoose from "mongoose";
import { DB_NAME } from "../utils/constant.js";

const connectDB = async () => {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`\n MongoDB connected ! to host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("mongo db connection failed  => " , error);
        process.exit(1)
    }
}

export default connectDB