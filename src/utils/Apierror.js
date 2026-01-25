class ApiError extends Error {
    constructor(statusCode, message, errors = [], stack = "") {
        super(message);
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        this.statusCode = statusCode;

        if (stack) {
            this.stack = stack;

        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
