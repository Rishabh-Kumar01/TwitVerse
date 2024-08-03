import { LikeService } from "../services/index.services.js";

const tweetService = LikeService.getInstance();

const toggleLike = async (req, res) => {
  try {
    const response = await tweetService.toggleLike(req.body);
    return res.status(200).json({
      success: true,
      message: "Like toggled successfully",
      data: response,
      error: [],
    });
  } catch (error) {
    console.log(error, "Error in like controller while toggling like");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: [],
      error: error,
    });
  }
};

export { toggleLike };
