import { jest } from "@jest/globals";
import UserService from "../../src/service/user.service.js";
import UserRepository from "../../src/repository/user.repository.js";
import { jwt, bcrypt } from "../../src/utils/imports.util.js";
import { serverConfig } from "../../src/config/serverConfig.js";

jest.mock("../../src/repository/user.repository.js");
jest.mock("../../src/utils/imports.util.js");
jest.mock("../../src/config/serverConfig.js");

describe("UserService - logIn", () => {
  test("should successfully log in a user and return a token", async () => {
    const email = "test@example.com";
    const password = "password123";
    const hashedPassword = "hashedPassword123";
    const userId = "user123";
    const token = "mockedToken";

    const mockUser = {
      id: userId,
      email: email,
      password: hashedPassword,
    };

    UserRepository.prototype.findByEmail = jest
      .fn()
      .mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue(token);

    const service = new UserService();
    const response = await service.logIn(email, password);

    expect(UserRepository.prototype.findByEmail).toHaveBeenCalledWith(email);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: userId, email: email },
      serverConfig.JWT_KEY,
      { expiresIn: "24h" }
    );
    expect(response).toBe(token);
  });

  test("should throw an error if user is not found", async () => {
    const email = "nonexistent@example.com";
    const password = "password123";

    UserRepository.prototype.findByEmail = jest
      .fn()
      .mockRejectedValue(new Error("User Not Found"));

    const service = new UserService();
    await expect(service.logIn(email, password)).rejects.toEqual({
      error: expect.objectContaining({
        message: "User Not Found",
      }),
    });
    expect(UserRepository.prototype.findByEmail).toHaveBeenCalledWith(email);
  });

  test("should throw an error if password is invalid", async () => {
    const email = "test@example.com";
    const password = "wrongPassword";
    const hashedPassword = "hashedPassword123";

    const mockUser = {
      id: "user123",
      email: email,
      password: hashedPassword,
    };

    UserRepository.prototype.findByEmail = jest
      .fn()
      .mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    const service = new UserService();
    await expect(service.logIn(email, password)).rejects.toEqual({
      error: expect.objectContaining({
        message: "Invalid Password",
      }),
    });
    expect(UserRepository.prototype.findByEmail).toHaveBeenCalledWith(email);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
  });

  test("should throw an error if token creation fails", async () => {
    const email = "test@example.com";
    const password = "password123";
    const hashedPassword = "hashedPassword123";
    const userId = "user123";

    const mockUser = {
      id: userId,
      email: email,
      password: hashedPassword,
    };

    UserRepository.prototype.findByEmail = jest
      .fn()
      .mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockImplementation(() => {
      throw new Error("Token creation failed");
    });

    const service = new UserService();
    await expect(service.logIn(email, password)).rejects.toEqual({
      error: {
        error: expect.any(Error),
      },
    });
    expect(UserRepository.prototype.findByEmail).toHaveBeenCalledWith(email);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(jwt.sign).toHaveBeenCalled();
  });
});
