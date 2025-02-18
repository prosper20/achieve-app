// import { Request, Response, NextFunction } from 'express';
// import AppError from "../utils/appError"

// interface ValidationError extends Error {
//   errors: { [key: string]: { message: string } };
// }

// interface CustomError extends Error {
//   statusCode: number;
//   status: string;
//   isOperational: boolean;
//   name: string;
//   message: string;
//   stack?: string;
//   code?: number;
// }

// const validationErrorHandlerDB = (err: ValidationError): AppError => {
//   const errors = Object.values(err.errors).map((el) => el.message);
//   const message = `Invalid input data. ${errors.join('. ')}`;
//   return new AppError(message, 400);
// };

// const sendErrorDev = (err: CustomError, res: Response): void => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack,
//   });
// };

// const sendErrorProd = (err: CustomError, res: Response): void => {
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   } else {
//     console.error('ERROR 💥', err);
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went very wrong!',
//     });
//   }
// };

// const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   if (process.env.NODE_ENV === 'development') {
//     console.log(err);
//     sendErrorDev(err, res);
//   } else if (process.env.NODE_ENV === 'production') {
//     let error: CustomError = { ...err };
//     error.message = err.message;

//     error = validationErrorHandlerDB(error);

//     sendErrorProd(error, res);
//   }
// };

// export default errorHandler;


import { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/appError";


const validationErrorHandlerDB = (err: Error | any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendError = (err: any, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);
    console.error("Stack Trace:", err.stack);

    // 2) Send generic message
    res.status(500).json(err);
  }
};

function handleError(
  err: Error | AppError | TypeError | any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;
  
if (
    error.name === "ValidationError" ||
    (error.errors
      ? error.errors[Object.keys(error.errors)[0]].name === "ValidatorError"
      : false)
  )
    error = validationErrorHandlerDB(error);

  sendError(error, res);
}

export default handleError;
