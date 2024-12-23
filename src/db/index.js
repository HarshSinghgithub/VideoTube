import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        const db = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("DB is coonected")

        return db;
    }
    catch (error){
        console.log("DB connection error", error)
    }
}

export default connectDB