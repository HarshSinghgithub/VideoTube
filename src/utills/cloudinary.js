import { v2 as cloudinary } from 'cloudinary';
import { configDotenv } from "dotenv"

configDotenv({ path: ".env" })

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDIANRY_API_KEY,
    api_secret: process.env.CLOUDIANRY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {resource_type:"auto"})

        return response
    }
    catch(error){
        console.log("Error while uploading image on cloudinary",error)
    }
}

export { uploadOnCloudinary }