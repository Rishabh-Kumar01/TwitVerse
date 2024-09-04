import { LikeService } from "../service/index.service.js";
import { responseCodes } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;

const likeService = LikeService.getInstance();

/**
 * @swagger
 * /v1/toggle-likes:
 *   post:
 *     summary: Toggle like on a tweet or comment
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: modelId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: modelType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Tweet, Comment]
 *     responses:
 *       200:
 *         description: Like toggled successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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
