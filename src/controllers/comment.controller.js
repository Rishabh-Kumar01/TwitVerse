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

const getComment = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await commentService.getById(id);
    res.status(200).json({
      success: true,
      message: "Comment fetched successfully",
      data: response,
      error: [],
    });
  } catch (error) {
    console.log(error, "Error in Comment Controller while fetching");
    res.status(500).json({
      success: false,
      message: "Comment fetch failed",
      data: [],
      error: error,
    });
  }
};
export { createComment, getComment };
