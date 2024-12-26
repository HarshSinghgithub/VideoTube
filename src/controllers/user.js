import {User} from "../models/User.js"
import { APIResponse } from "../utills/APIRespones.js";
import { uploadOnCloudinary } from "../utills/clodinary.js";

const registerUser = async (req, res) => {
    try{
        const {userName, fullName, email, password} = req.body;

        if([fullName, userName, email, password].some((field) => field?.trim() === "")){
            return APIResponse.error(res, "All fields are required", "", 500);
        }

        const existedUser = await User.findOne({
            $or : [{email}, {userName}]
        })

        if(existedUser){
            return APIResponse.error(res, "User with this username or email already exists", "", 201);
        }

        const avatarLocalPath = req.files?.avatar[0]?.path

        if(!avatarLocalPath){
            return APIResponse.error(res, "Avatar is required", "", 500);
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if(!avatar){
            return APIResponse.error(res, "Unable to process image", "", 500);
        }

        const user = await User.create({
            userName: userName,
            fullName: fullName,
            email: email,
            password: password,
            avatar: avatar.url
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            return APIResponse.error(res, "Something went wrong while registering user", "", 500)
        }

        return APIResponse.success(res, "User Registerd Succesfully", createdUser, 200)

    }
    catch(error){
        console.log(error)
    }
}

export {registerUser}