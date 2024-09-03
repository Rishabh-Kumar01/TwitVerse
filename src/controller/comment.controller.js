import { CommentService } from "../service/index.service.js";
import { responseCodes } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;

const commentService = CommentService.getInstance();

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
