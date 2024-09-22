import { UserService } from "../service/index.service.js";
import { responseCodes } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;

const userService = UserService.getInstance();

/**
 * @swagger
 * /v1/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /v1/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const jwtToken = await userService.logIn(email, password);
    res.status(StatusCodes.OK).json({
      message: "User logged in successfully",
      success: true,
      data: {
        token: jwtToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const followUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followedId = req.params.id;
    const result = await userService.followUser(followerId, followedId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User followed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followedId = req.params.id;
    const result = await userService.unfollowUser(followerId, followedId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User unfollowed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserFollowers = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const followers = await userService.getUserFollowers(userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User followers retrieved successfully",
      data: followers,
    });
  } catch (error) {
    next(error);
  }
};

const getUserFollowing = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const following = await userService.getUserFollowing(userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User following retrieved successfully",
      data: following,
    });
  } catch (error) {
    next(error);
  }
};

export {
  signUp,
  logIn,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
};
