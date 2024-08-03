import { CommentService } from "../services/index.services.js";

const commentService = CommentService.getInstance();

const createComment = async (req, res) => {
  try {
    const { content, modelType, modelId, userId } = req.body;
    const response = await commentService.create({
      content,
      modelType,
      modelId,
      userId,
    });
    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: response,
      error: [],
    });
  } catch (error) {
    console.log(error, "Error in Comment Controller while creating");
    res.status(500).json({
      success: false,
      message: "Comment creation failed",
      data: [],
      error: error,
    });
  }
};

export { createComment };
