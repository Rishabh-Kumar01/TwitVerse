import { LikeService } from "../service/index.service.js";
import { responseCodes } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;

const likeService = LikeService.getInstance();

const toggleLike = async (req, res, next) => {
  try {
    const { modelId, modelType } = req.query;
    const userId = req.user.id;
    const response = await likeService.toggleLike({
      userId,
      modelId,
      modelType,
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Like toggled successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export { toggleLike };
