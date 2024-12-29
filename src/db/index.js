import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const db = await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log("DB is coonected")

        return db;
    }
    catch (error){
        console.log("DB connection error", error)
    }
}

export default connectDB