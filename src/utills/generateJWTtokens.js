import { User } from "../models/User.js"
import { APIError } from "./APIError.js"

export const generateAceessAndRefreshToken = async (userId) =>{
    try{
        const user = await User.findById(userId)

        const accessToken = user.getAccessToken()
        const refreshToken = user.getRefreshToken()

        // console.log("Access Token: ", accessToken)
        // console.log("Refresh Token: ", refreshToken)

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    }
    catch(error){
        console.log("Error Occurred while generating Tokens", error)

        return new APIError(500, error)
    }
}


