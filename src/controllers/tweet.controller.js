import { TweetService } from "../services/index.services.js";

const tweetService = TweetService.getInstance();

const createTweet = async (req, res) => {
  try {
    if (!req.body.content) {
      throw new Error("Content is required");
    }
    if(!req.files) {
      throw new Error("Image is required");
    }
    const files = req.files;
    const imageUrls = await Promise.all(files.map(file => tweetService.uploadImage(file)));
    const data = {
      content: req.body.content,
      images: imageUrls,
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
    if (!req.files) {
      throw new Error("Image is required");
    }
    const files = req.files;
    let imageUrls = [];
    for (const file of files) {
      const url = await tweetService.uploadImage(file);
      imageUrls.push(url);
    }
    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: imageUrls,
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

const deleteTweet = async (req, res) => {
  try {
    const tweetId = req.params.id;
    await tweetService.deleteTweet(tweetId);
    return res.status(200).json({
      success: true,
      message: "Tweet deleted successfully",
      data: [],
      error: [],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Failed to delete tweet",
      data: [],
      error: error.message,
    });
  }
}

export { createTweet, getTweets, uploadImage, deleteTweet };
