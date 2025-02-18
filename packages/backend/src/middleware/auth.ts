// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
// import {AppError} from '../utils/appError';

// const decodeJwtToken = (token: string, jwtSecret: string): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     try {
//       const decoded = jwt.verify(token, jwtSecret);
//       resolve(decoded);
//     } catch (err) {
//       new Error("Session expired, please login again!");
//       reject(Error);
//     }
//   });
// };

// export const protect = async (req: Request | any, res: Response, next: NextFunction) => {
//   let token;
//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return next(new AppError("You are not logged in! Please log in to get access.", 401));
//   }

//   try {
//     const decoded: any = await decodeJwtToken(token, 'JWT_EMAIL_SECRET');
//     req.user = decoded;
//     next();
//   } catch (error) {
//     next(new AppError("Session expired, please login again!", 401));
//   }
// };

// type Role = "staff" | "admin" | "superAdmin";

// export const restrictTo = (...roles: Role[]) => {
//   return (req: Request | any, res: Response, next: NextFunction) => {
//     if (!roles.includes(req.user.role as Role)) {
//       return next(new AppError("You do not have permission to perform this action", 403));
//     }
//     next();
//   };
// };


// import { Request, Response, NextFunction } from 'express';
// import AppError from '../utils/appError';

// export const protect = (req: Request, res: Response, next: NextFunction) => {
//   // Your authentication logic here (JWT or session-based)
//   const user = req.user; // Assuming user data is set in req.user after authentication
//   if (!user) {
//     return next(new AppError('You must be logged in to access this route', 401));
//   }
//   next();
// };

// export const restrictTo = (...roles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const user = req.user; // Assuming user data is set in req.user
//     if (!roles.includes(user.role)) {
//       return next(new AppError('You do not have permission to perform this action.', 403));
//     }
//     next();
//   };
// };

import * as jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import * as config from "../config/index";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import staffData from '../../testData/staffs.json';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
}

const staffArray: User[] = staffData as User[];

export const decodeJwtToken: Function = (
  token: string,
  jwtSecret: string
): Promise<any> => {
  return new Promise((resolve: Function, reject: Function): void => {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      return resolve(decoded);
    } catch (err: any) {
      err.message = "Session expired, please login again!";
      return reject(err);
    }
  });
};

export const signToken = (id: string) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

export const signRefreshToken = (id: string) => {
  return jwt.sign({ id }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRE,
  });
};

export const createSendToken = async (
  user: User,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user.id.toString());
  const refreshToken = signRefreshToken(user.id.toString());

  const cookieOptions = {
    expires: new Date(Date.now() + config.JWT_REFRESH_EXPIRE * 1000),
    httpOnly: true,
    secure: false,
    sameSite: 'none' as 'none',
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie('id', user.id.toString(), cookieOptions)
   .cookie('refresh', refreshToken, cookieOptions);

  // Remove sensitive data from output
  const { password, ...cleanUser } = user;


  res.status(statusCode).json({
    status: "success",
    token,
    expiresIn: config.JWT_EXPIRE,
    data: {
      cleanUser,
    },
  });
};

export const protect = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    // Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // Verification token
    const decoded: any = await decodeJwtToken(token, config.JWT_SECRET);

    // Check if user still exists
    const currentUser = staffArray.find((staff) => staff.id === decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  }
);

type Role = "staff" | "admin" | "superAdmin";

export const restrictTo = (...roles: string[]) => {
  return (req: Request | any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role as Role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
