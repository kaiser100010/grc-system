import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};