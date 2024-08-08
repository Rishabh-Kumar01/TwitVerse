import { TweetService } from "../services/index.services.js";

const tweetService = TweetService.getInstance();

const createTweet = async (req, res) => {
  try {
    if (!req.body.content) {
      throw new Error("Content is required");
    }
    const data = {
      content: req.body.content,
    };
    const tweet = await tweetService.createTweet(data);
    res.status(201).json({
      success: true,
      message: "Tweet created successfully",
      data: tweet,
      error: [],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Tweet creation failed",
      data: [],
      error: error.message,
    });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("Image is required");
    }
    const file = req.file;
    console.log(file, "file");
    const imageUrl = await tweetService.uploadImage(file);
    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: imageUrl,
      error: [],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Image upload failed",
      data: [],
      error: error.message,
    });
  }
};

const getTweets = async (req, res) => {
  try {
    console.log("getTweets");
    return res.status(200).json({
      success: true,
      message: "Tweets retrieved successfully",
      data: [],
      error: [],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Failed to get tweets",
      data: [],
      error: error.message,
    });
  }
};

export { createTweet, getTweets, uploadImage };
