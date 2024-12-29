import { APIResponse } from "../utills/APIRespones.js"

const healthCheck = async (req, res) =>{
    console.log("Reached to healthCheck controller")
    return APIResponse.success(res, "Connection is OK", "", 200);
}

export {healthCheck}