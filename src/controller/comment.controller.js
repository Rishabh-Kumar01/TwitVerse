import { CommentService } from "../service/index.service.js";
import { responseCodes } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;

const commentService = CommentService.getInstance();

/**
 * @swagger
 * /v1/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               modelType:
 *                 type: string
 *                 enum: [Tweet, Comment]
 *               modelId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const createComment = async (req, res, next) => {
  try {
    const { content, modelType, modelId } = req.body;
    const userId = req.user.id;
    const response = await commentService.create({
      content,
      modelType,
      modelId,
      userId,
    });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Comment created successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /v1/comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
const getComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;

    const response = await commentService.getById(commentId, page, size);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Comment fetched successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export { createComment, getComment };
