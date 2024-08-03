import { UserService } from "../services/index.services.js";

const userService = UserService.getInstance();

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const response = await userService.create(req.body);
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

export { createUser };
