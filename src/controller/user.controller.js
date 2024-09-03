import { UserService } from "../service/index.service.js";
import { responseCodes } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;

const userService = UserService.getInstance();

const signUp = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const user = await userService.create({ email, password, name });
    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await userService.logIn(email, password);
    res.status(StatusCodes.OK).json({
      message: "User logged in successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

export { signUp, logIn };
