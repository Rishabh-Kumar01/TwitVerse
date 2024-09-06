import { UserRepository } from "../repository/index.repository.js";
import { ServiceError, DatabaseError } from "../error/custom.error.js";
import { jwt, bcrypt, responseCodes } from "../utils/imports.util.js";
import { serverConfig, kafkaConfig } from "../config/index.config.js";

const { StatusCodes } = responseCodes;

class UserService {
  constructor() {
    this.userRepository = UserRepository.getInstance();
  }

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async #createToken(user, expireTime) {
    try {
      return jwt.sign(user, serverConfig.JWT_KEY, { expiresIn: expireTime });
    } catch (error) {
      throw new ServiceError(
        "Token creation failed",
        "An error occurred while creating the authentication token",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async #checkPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new ServiceError(
        "Password check failed",
        "An error occurred while verifying the password",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(userData) {
    try {
      const userExists = await this.userRepository.findByEmail(userData.email);
      if (userExists) {
        throw new ServiceError(
          "User already exists",
          "A user with the provided email already exists",
          StatusCodes.CONFLICT
        );
      }

      const user = await this.userRepository.create(userData);

      if (!user) {
        throw new ServiceError(
          "User creation failed",
          "An error occurred while creating the user",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const jwtToken = await this.#createToken(
        {
          userId: user._id,
          email: user.email,
        },
        "5m"
      );

      // Publish user created event to Kafka
      await kafkaConfig.sendOtpRequest("otp-notifications", {
        type: "SEND_OTP",
        data: {
          userId: user._id,
          email: user.email,
          action: "TWO_FACTOR_AUTH",
          timestamp: new Date().toISOString(),
        },
      });

      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        token: jwtToken,
      };
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to create user",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      if (error instanceof ServiceError) {
        throw error;
      }

      throw new ServiceError(
        "User creation failed",
        "An error occurred while creating the user",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async logIn(email, password) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new ServiceError(
          "User not found",
          "No user found with the provided email",
          StatusCodes.NOT_FOUND
        );
      }

      const isPasswordValid = await this.#checkPassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        throw new ServiceError(
          "Invalid credentials",
          "The provided password is incorrect",
          StatusCodes.UNAUTHORIZED
        );
      }

      const token = await this.#createToken(
        {
          userId: user._id,
          email: user.email,
        },
        "24h"
      );

      return token;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Login failed",
        "An error occurred during the login process",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getById(id) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new ServiceError(
          "User not found",
          "No user found with the provided ID",
          StatusCodes.NOT_FOUND
        );
      }
      return user;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to retrieve user",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "User retrieval failed",
        "An error occurred while retrieving the user",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id, userData) {
    try {
      const updatedUser = await this.userRepository.update(id, userData);
      if (!updatedUser) {
        throw new ServiceError(
          "User not found",
          "No user found with the provided ID",
          StatusCodes.NOT_FOUND
        );
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to update user",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "User update failed",
        "An error occurred while updating the user",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id) {
    try {
      const deletedUser = await this.userRepository.delete(id);
      if (!deletedUser) {
        throw new ServiceError(
          "User not found",
          "No user found with the provided ID",
          StatusCodes.NOT_FOUND
        );
      }
      return deletedUser;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to delete user",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "User deletion failed",
        "An error occurred while deleting the user",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default UserService;
