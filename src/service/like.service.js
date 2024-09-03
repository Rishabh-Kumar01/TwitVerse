import {
  LikeRepository,
  TweetRepository,
  CommentRepository,
} from "../repository/index.repository.js";
import { ServiceError, DatabaseError } from "../error/custom.error.js";
import { responseCodes } from "../utils/imports.util.js";
const { StatusCodes } = responseCodes;

class LikeService {
  constructor() {
    this.likeRepository = LikeRepository.getInstance();
    this.tweetRepository = TweetRepository.getInstance();
    this.commentRepository = CommentRepository.getInstance();
  }

  static getInstance() {
    if (!LikeService.instance) {
      LikeService.instance = new LikeService();
    }
    return LikeService.instance;
  }

  async toggleLike(data) {
    try {
      let modelIdExists;

      if (data.modelType === "Tweet") {
        modelIdExists = await this.tweetRepository.getById({
          _id: data.modelId,
        });
      } else if (data.modelType === "Comment") {
        modelIdExists = await this.commentRepository.getById({
          _id: data.modelId,
        });
      }

      if (!modelIdExists) {
        throw new ServiceError(
          "Model not found",
          "The specified model does not exist",
          StatusCodes.NOT_FOUND
        );
      }

      let isExists = await this.likeRepository.getById({
        userId: data.userId,
        likeable: data.modelId,
      });

      if (isExists) {
        const response = await this.likeRepository.delete(isExists._id);
        if (response.deletedCount === 0) {
          throw new ServiceError(
            "Like not deleted",
            "Failed to remove the like",
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }

        if (data.modelType === "Tweet") {
          await this.tweetRepository.update(data.modelId, {
            $inc: { countOfLikes: -1 },
          });
        } else if (data.modelType === "Comment") {
          await this.commentRepository.update(data.modelId, {
            $inc: { countOfLikes: -1 },
          });
        }

        return {
          action: "unliked",
          like: {
            userId: data.userId,
            modelId: data.modelId,
            modelType: data.modelType,
          },
        };
      } else {
        const response = await this.likeRepository.create({
          userId: data.userId,
          likeable: data.modelId,
          onModel: data.modelType,
        });
        if (!response) {
          throw new ServiceError(
            "Like not created",
            "Failed to create the like",
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }

        if (data.modelType === "Tweet") {
          await this.tweetRepository.update(data.modelId, {
            $inc: { countOfLikes: 1 },
          });
        } else if (data.modelType === "Comment") {
          await this.commentRepository.update(data.modelId, {
            $inc: { countOfLikes: 1 },
          });
        }
        return {
          action: "liked",
          like: {
            id: response._id,
            userId: response.userId,
            modelId: response.likeable,
            modelType: response.onModel,
          },
        };
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to toggle like",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Like toggle failed",
        "An error occurred while toggling the like",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default LikeService;
