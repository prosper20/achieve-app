import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { AppError } from './utils/appError';
import errorHandler from './controllers/errorController';
import loanRouter from './routes/loanRoutes';
import authRouter from './routes/authRoutes';

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);
app.use(loanRouter);

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
