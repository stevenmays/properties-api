import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../lib/custom-error';

/**
 * Custom error handling middleware. If express enocu
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Check if the error is a CustomError
  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Log the error
  console.error(err);

  // Send the error response
  return res.status(statusCode).json({ error: message });
}
