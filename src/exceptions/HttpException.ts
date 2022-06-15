class HttpException extends Error {
  statusCode: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode || 400;
    this.message = message || "Bad Request";
    Object.setPrototypeOf(this, HttpException.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpException);
    }
  }
}

export default HttpException;
