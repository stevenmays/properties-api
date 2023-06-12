/**
 * Custom error class, to throw specific error codes.
 */
export class CustomError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
