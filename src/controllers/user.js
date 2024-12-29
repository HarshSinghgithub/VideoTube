import {User} from "../models/User.js"
import { APIResponse } from "../utills/APIRespones.js";
import { uploadOnCloudinary } from "../utills/cloudinary.js";
import { unlinkSync } from 'fs'
import { generateAceessAndRefreshToken } from "../utills/generateJWTtokens.js";
import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv";

configDotenv({ path: ".env" })

const registerUser = async (req, res) => {
    console.log("Reached to registerUser controller")
    try{

        console.log("Request Body: ", req.body)
        console.log("Request files: ", req.file)
        console.log("path: ", req.file.path)

        if(!req.body){
            return APIResponse.error(res, "Body is empty", "", 500)
        }

        if(!req.file){
            return APIResponse.error(res, "Avatar is required", "", 500)
        }

        const {userName, fullName, email, password} = req.body;

        if([fullName, userName, email, password].some((field) => !field || field.trim() === "")){
            return APIResponse.error(res, "All fields are required", "", 500);
        }

        const existedUser = await User.findOne({
            $or : [{email}, {userName}]
        })

        if(existedUser){
            return APIResponse.error(res, "User with this username or email already exists", "", 201);
        }

        const avatarLocalPath = req.file.path

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
        console.log("Some error occured while registering user", error)

        return APIResponse.error(res, error, "", 500)
    }
    finally{
        if(req.file){
            const avatarLocalPath = req.file.path

            unlinkSync(avatarLocalPath)

            console.log("Avatar File deleted successfully")
        }
    }
}

const loginUser = async (req, res) =>{
    console.log("Executing login user controller")
    try{
        if(!req.body){
            return APIResponse.error(res, "Request Body is empty", "", 500)
        }

        console.log(req.body)

        const {email, password} = req.body

        console.log("Email: ", email)
        console.log("Password: ", password)

        if([email, password].some((field) => !field || field.trim() === "")){
            return APIResponse.error(res, "All fields are required", "", 500);
        }

        const user = await User.findOne({email})

        if(!user){
            return APIResponse.error(res, "User not exist", "", 500)
        }

        const isPasswordValid = await user.isPasswordCorrect(password)
        console.log("isPasswordVaild", isPasswordValid)

        if(!isPasswordValid){
            return APIResponse.error(res, "Password is incorrect", "", 500)
        }

        console.log("Password is Correct")
        const {accessToken, refreshToken} = await generateAceessAndRefreshToken(user._id)

        const loggedInUser = await User.findById(user._id).select(" -password -refreshToken")

        const options = {
            httpOnly:true,
            secure:true
        }

        const cookies = [
            {name: "accessToken", value: accessToken, options: options},
            {name: "refreshToken", value: refreshToken, options: options}
        ]

        return APIResponse.success(res, "User Logged in successfully", loggedInUser, 200, cookies)
        
    }
    catch(error){
        console.log("Error occured while trying to login user", error)

        return APIResponse.error(res, error.message, "", 500)
    }
}

const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if(!incomingRefreshToken){
        return APIResponse.error(res, "No Refresh Token", "", 500)
    }

    console.log("Refresh Token: ",incomingRefreshToken)

    try{
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        console.log("Decoded Token: ", decodedToken)
        const user = await User.findById(decodedToken._id)
        console.log("User Refresh Token: ", user.refreshToken)

        if(!user){
            return APIResponse.error(res, "Invalid Refresh Token", "", 500)
        }

        if(incomingRefreshToken !== user.refreshToken){
            return APIResponse.error(res, "Refresh Token expired", "", 500)
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, refreshToken} = await generateAceessAndRefreshToken(user._id)

        console.log("New Access Token: ", accessToken)
        console.log("New Refresh Token: ", refreshToken)

        const cookies = [
            {name:"accessToken", value:accessToken, options:options},
            {name:"refreshToken", value:refreshToken, options:options}
        ]

        return APIResponse.success(res, "Access Token refresed succesfully", "", 200, cookies)
    }
    catch(error){
        console.log("Refresh Token error", error)
        return APIResponse.error(res, error, "", 500)
    }

}

export {registerUser, loginUser, refreshAccessToken}