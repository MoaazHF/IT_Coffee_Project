import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class HttpError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFoundMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  next(new HttpError(404, "NOT_FOUND", `Route not found: ${req.method} ${req.path}`));
};

export const errorHandlerMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid request payload",
      details: error.issues,
      requestId: req.requestId
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({
      code: error.code,
      message: error.message,
      details: error.details,
      requestId: req.requestId
    });
    return;
  }

  res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Unexpected server error",
    requestId: req.requestId
  });
};
