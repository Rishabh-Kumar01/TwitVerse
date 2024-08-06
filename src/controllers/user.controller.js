import { UserService } from "../services/index.services.js";
import {responseCodes} from "../utils/imports.util.js"

const { StatusCodes } = responseCodes;


const userService = UserService.getInstance();

const signUp = async (req, res) => {
  try {
    const response = await userService.create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: response,
      error: [],
    });
  } catch (error) {
    console.log(error, "Error in user controller while creating user");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: [],
      error: error,
    });
  }
};

const logIn = async (req, res) =>  {
  try {
    const token = await userService.logIn(req.body.email, req.body.password);
    return res.status(StatusCodes.OK).json({
      message: "User Logged In Successfully",
      success: true,
      data: token,
      error: {},
    });
  } catch (error) {
    console.log("Something Went Wrong: User Controller: Log In User", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        message:"Something Went Wrong",
        success: false,
        data: {},
        error: error,
      });
  }
}

export { signUp , logIn};
