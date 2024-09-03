import { TweetService } from "../service/index.service.js";
import { ServiceError } from "../error/custom.error.js";
import { responseCodes } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;

const tweetService = TweetService.getInstance();

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

const deleteTweet = async (req, res, next) => {
  try {
    const tweetId = req.params.id;
    const response = await tweetService.deleteTweet(tweetId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: response.message || "Tweet deleted successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export { createTweet, getTweets, uploadImage, deleteTweet };
