import { responseCodes } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;

class AppError extends Error {
  constructor(name, message, explanation, statusCode) {
    super();
    this.name = name;
    this.message = message;
    this.explanation = explanation;
    this.statusCode = statusCode;
  }
}

class ValidationError extends AppError {
  constructor(error) {
    super(
      "ValidationError",
      "Invalid data",
      error.message,
      StatusCodes.BAD_REQUEST
    );
  }
}

class DatabaseError extends AppError {
  constructor(error) {
    super(
      "DatabaseError",
      error.explanation || "Database operation failed",
      error.message,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

class ServiceError extends AppError {
  constructor(
    message,
    explanation,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super("ServiceError", message, explanation, statusCode);
  }
}

class AuthenticationError extends AppError {
  constructor(message, explanation) {
    super(
      "AuthenticationError",
      message,
      explanation,
      StatusCodes.UNAUTHORIZED
    );
  }
}

export {
  AppError,
  ValidationError,
  DatabaseError,
  ServiceError,
  AuthenticationError,
};
