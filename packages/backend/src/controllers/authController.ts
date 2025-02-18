import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {AppError} from '../utils/appError';
import staffData from '../../testData/staffs.json';
import { asyncHandler } from '../utils/asyncHandler';
import { createSendToken } from '../middleware/auth';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
}

const staffArray: User[] = staffData as User[];

const findUserByEmail = (email: string): User | undefined => {
  return staffArray.find((staff) => staff.email === email);
};

 export const  login: RequestHandler = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    try {
      const user = findUserByEmail(email);

      if (!user) {
        return res
          .status(400)
          .json({ message: "Failed! incorrect email or password" });
      }

      const isMatch: boolean = password === user.password;

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Failed! incorrect email or password" });
      }

      createSendToken(user, 200, res);
    } catch (err) {
      next(err);
    }
  });

  export const logout: RequestHandler = asyncHandler(
    async (req, res, next) => {
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return next(new AppError("token required", 401));
      }
      //delete refreh token from storage
      try {

          res.cookie("jwt", " ");
          return res.status(200).json({
            status: "success",
            message: "Logout successful",
          });
      } catch (err) {
        return next(new AppError("Error logging out", 500));
      }
    }
  );

