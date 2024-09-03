import { responseCodes } from "../utils/imports.util.js";
import {
  AppError,
  ServiceError,
  DatabaseError,
  ValidationError,
} from "./custom.error.js";

const { StatusCodes } = responseCodes;

const baseError = (err, req, res, next) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
      error: err.explanation,
    });
  }

  if (err instanceof ServiceError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.explanation,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Validation Error",
      success: false,
      error: err.explanation,
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Database Error",
      success: false,
      error: err.explanation,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Something went wrong",
    success: false,
    error: "Internal server error",
  });
};

export default baseError;
