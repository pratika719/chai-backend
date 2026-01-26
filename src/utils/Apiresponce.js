class ApiResponse {
    constructor(statusCode,success, message="success", data = null) {
        this.success = statusCode<400;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }}


export {ApiResponse}
