class ApiError extends Error {
  constructor(
    statusCode,
    message = "Somthing went wrong",
    error = [],
    stack = ""
  ) {
    super(message);
    (this.statusCode = statusCode),
      (this.message = message),
      (this.data = []),
      (this.error = error),
      (this.success = false);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
