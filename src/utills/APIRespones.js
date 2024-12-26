class APIResponse{
    static success(res, message="Request was Successful", data="", statusCode=200){
        return res.status(statusCode).json({
            status : "success",
            data : data,
            message : message
        });
    }

    static error(res, message="Internal Server Error", data="", statusCode=500){
        return res.status(statusCode).json({
            status : "error",
            data : data,
            message : message
        });
    }
}

export {APIResponse}