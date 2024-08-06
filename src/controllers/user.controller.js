import { UserService } from "../services/index.services.js";

const userService = UserService.getInstance();

const signUp = async (req, res) => {
  try {
    console.log(req.body);
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


export { signUp };
