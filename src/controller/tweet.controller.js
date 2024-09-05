import { TweetService } from "../service/index.service.js";
import { ServiceError } from "../error/custom.error.js";
import { responseCodes } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;

const tweetService = TweetService.getInstance();

/**
 * @swagger
 * /v1/tweets:
 *   post:
 *     summary: Create a new tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tweet created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const createTweet = async (req, res, next) => {
  try {
    if (!req.body.content) {
      throw new ServiceError(
        "Content is required",
        "Tweet content is missing",
        StatusCodes.BAD_REQUEST
      );
    }
    if (!req.files) {
      throw new ServiceError(
        "Image is required",
        "Tweet image is missing",
        StatusCodes.BAD_REQUEST
      );
    }
    const files = req.files;
    const imageUrls = await Promise.all(
      files.map((file) => tweetService.uploadImage(file))
    );
    const data = {
      content: req.body.content,
      images: imageUrls,
    };
    const tweet = await tweetService.createTweet(data);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Tweet created successfully",
      data: tweet,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /v1/upload-image:
 *   post:
 *     summary: Upload images
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const uploadImage = async (req, res, next) => {
  try {
    if (!req.files) {
      throw new ServiceError(
        "Image is required",
        "No image files were uploaded",
        StatusCodes.BAD_REQUEST
      );
    }
    const files = req.files;
    const imageUrls = await Promise.all(
      files.map((file) => tweetService.uploadImage(file))
    );
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Image uploaded successfully",
      data: imageUrls,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /v1/tweets:
 *   get:
 *     summary: Get all tweets
 *     tags: [Tweets]
 *     responses:
 *       200:
 *         description: Tweets retrieved successfully
 *       500:
 *         description: Server error
 */
const getTweets = async (req, res, next) => {
  try {
    const tweets = await tweetService.getTweets();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tweets retrieved successfully",
      data: tweets,
    });
  } catch (error) {
    next(error);
  }
};

const getTweetById = async (req, res, next) => {
  try {
    const tweetId = req.params.id;
    const tweet = await tweetService.getTweetById(tweetId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tweet retrieved successfully",
      data: tweet,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /v1/tweets/{id}:
 *   delete:
 *     summary: Delete a tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tweet deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tweet not found
 *       500:
 *         description: Server error
 */
const deleteTweet = async (req, res, next) => {
  try {
    const tweetId = req.params.id;
    await tweetService.deleteTweet(tweetId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tweet deleted successfully",
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

export { createTweet, getTweets, uploadImage, deleteTweet, getTweetById };
