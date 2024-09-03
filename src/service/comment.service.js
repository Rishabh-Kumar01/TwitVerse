import CrudService from "./crud.service.js";
import {
  CommentRepository,
  TweetRepository,
} from "../repository/index.repository.js";
import { ServiceError } from "../error/custom.error.js";
import { responseCodes } from "../utils/imports.util.js";
const { StatusCodes } = responseCodes;

class CommentService extends CrudService {
  constructor() {
    super(CommentRepository.getInstance());
    this.tweetRepository = TweetRepository.getInstance();
  }

  static getInstance() {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService();
    }
    return CommentService.instance;
  }

  async create(data) {
    try {
      let isExists;
      if (data.modelType === "Tweet") {
        isExists = await this.tweetRepository.getTweetById(data.modelId);
      } else if (data.modelType === "Comment") {
        isExists = await this.repository.getById({
          _id: data.modelId,
        });
      }

      if (!isExists) {
        throw new ServiceError(
          "Model not found",
          "The specified model does not exist",
          StatusCodes.NOT_FOUND
        );
      }

      const comment = await this.repository.create({
        content: data.content,
        onModel: data.modelType,
        commentable: data.modelId,
        userId: data.userId,
        comments: [],
      });

      if (data.modelType === "Tweet") {
        await this.tweetRepository.updateTweet(data.modelId, {
          $inc: { countOfComments: 1 },
        });
      } else if (data.modelType === "Comment") {
        await this.repository.update(data.modelId, {
          $push: { comments: comment._id },
        });
      }

      return {
        content: comment.content,
        modelType: comment.onModel,
        modelId: comment.commentable,
        userId: comment.userId,
      };
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Comment creation failed",
        "An error occurred while creating the comment",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default CommentService;
