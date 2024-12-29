class APIResponse {
    static success(res, message = "Request was Successful", data = "", statusCode = 200, cookies = []) {

        if(cookies.length > 0){
            cookies.forEach(
                ({name, value, options}) => {
                    res.cookie(name, value, options)
                }
            )
        }

        return res.status(statusCode).json({
            status: "success",
            data: data,
            message: message
        });
    }

    static error(res, message = "Internal Server Error", data = "", statusCode = 500, cookies = []) {
        if(cookies.length > 0){
            cookies.forEach(
                ({name, value, options}) => {
                    res.cookie(name, value, options)
                }
            )
        }


        return res.status(statusCode).json({
            status: "error",
            data: data,
            message: message
        });
    }
}

export { APIResponse }