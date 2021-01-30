import { Request, Response, NextFunction } from "express";
import ExtendedError from "../common/http-exception";

export const errorHandler = (
  error: ExtendedError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const status = error.statusCode || 500;
  const message =
    error.message || "It's not you. It's us. We are having some problems.";

  response.status(status).json({error:message,validationErrors:error.validationErrors});
};