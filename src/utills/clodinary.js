import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDIANRY_API_KEY,
    api_secret: process.env.CLOUDIANRY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null

        response = await cloudinary.uploader.upload(localFilePath)
        fs.unlinkSync(localFilePath)

        return response
    }
    catch(error){
        console.log(error)
        fs.unlinkSync(localFilePath);
    }
}

export { uploadOnCloudinary }