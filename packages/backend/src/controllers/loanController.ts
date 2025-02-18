import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import {asyncHandler }from '../utils/asyncHandler';
import { AppError } from '../utils/appError';

export interface Applicant {
  name: string;
  email: string;
  telephone: string;
  totalLoan: string;
}

export interface Loan {
  id: string;
  amount: string;
  maturityDate: string;
  status: string;
  applicant: Applicant;
  createdAt: string;
}

const loansDataPath = path.join(__dirname, '../data/loans.json');

const getLoansFromFile = (): Loan[] => {
  const data = fs.readFileSync(loansDataPath, 'utf-8');
  return JSON.parse(data);
};

export const getAllLoans = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const loans = getLoansFromFile();

  const filteredLoans = loans.map((loan) => {
    const { totalLoan, ...applicantData } = loan.applicant;
    return {
      ...loan,
      applicant: applicantData,
    };
  });

  res.status(200).json({
    status: 'success',
    results: filteredLoans.length,
    data: {
      loans: filteredLoans,
    },
  });
});

export const getLoansByStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.query;
  const loans = getLoansFromFile();

  const filteredLoans = loans.filter((loan) => loan.status === status);

  const updatedLoans = filteredLoans.map((loan) => {
    const { totalLoan, ...applicantData } = loan.applicant;
    return {
      ...loan,
      applicant: applicantData,
    };
  });

  res.status(200).json({
    status: 'success',
    results: updatedLoans.length,
    data: {
      loans: updatedLoans,
    },
  });
});

export const getUserLoans = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userEmail } = req.params;
  const loans = getLoansFromFile();

  const userLoans = loans.filter((loan) => loan.applicant.email === userEmail);

  if (!userLoans.length) {
    return res.status(200).json({
      status: 'success',
      data: {
        loans: [],
      },
    });
  }

  const updatedUserLoans = userLoans.map((loan) => {
    const { totalLoan, ...applicantData } = loan.applicant;
    return {
      ...loan,
      applicant: applicantData,
    };
  });

  res.status(200).json({
    status: 'success',
    results: updatedUserLoans.length,
    data: {
      loans: updatedUserLoans,
    },
  });
});

export const getExpiredLoans = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const loans = getLoansFromFile();

  const expiredLoans = loans.filter((loan) => new Date(loan.maturityDate) < new Date());

  const updatedExpiredLoans = expiredLoans.map((loan) => {
    const { totalLoan, ...applicantData } = loan.applicant;
    return {
      ...loan,
      applicant: applicantData,
    };
  });

  res.status(200).json({
    status: 'success',
    results: updatedExpiredLoans.length,
    data: {
      loans: updatedExpiredLoans,
    },
  });
});

export const deleteLoan = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
 
  const { loanId } = req.params;
  const loans = getLoansFromFile();

  const updatedLoans = loans.filter((loan) => loan.id !== loanId);

  if (loans.length === updatedLoans.length) {
    return next(new AppError('No loan found with that ID', 404));
  }

  // Update the JSON file with the modified loans
  fs.writeFileSync(loansDataPath, JSON.stringify(updatedLoans, null, 2));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
