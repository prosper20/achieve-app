class AppError extends Error {
  isOperational: boolean = true;
  status: string;
  constructor(public message: string, public statusCode: number) {
    super(message);

    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };
