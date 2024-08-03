import {
  LikeRepository,
  TweetRepository,
  CommentRepository,
} from "../repository/index.repository.js";
import CrudService from "./crud.service.js";
import { mongoose } from "../utils/imports.util.js";

class LikeService extends CrudService {
  constructor() {
    const likeRepository = LikeRepository.getInstance();
    super(likeRepository);
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
      // Check if the tweet exists
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
      console.log(
        modelIdExists,
        "ModelIdExists in Like Service while toggling like"
      );
      if (!modelIdExists) {
        throw new Error("Model Id does not exist");
      }

      // Check if the like already exists
      let isExists;

      if (data.modelType === "Tweet") {
        isExists = await this.repository.getById({
          userId: data.userId,
          likeable: data.modelId,
        });
      } else if (data.modelType === "Comment") {
        isExists = await this.repository.getById({
          userId: data.userId,
          likeable: data.modelId,
        });
      }
      console.log(isExists, "IsExists in Like Service while toggling like");
      if (isExists) {
        // If like exists, delete it and reduce the like count by 1
        const response = await this.repository.delete(isExists._id);
        if (response.deletedCount === 0) {
          throw new Error("Like not deleted");
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
        // If like does not exist, create it and increase the like count by 1
        const response = await this.repository.create({
          userId: data.userId,
          likeable: data.modelId,
          onModel: data.modelType,
        });
        if (!response) {
          throw new Error("Like not created");
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
      console.log(error, "Error in Like Service while toggling like");
      throw new Error(
        `Error in Like Service while toggling like: ${error.message}`
      );
    }
  }
}

export default LikeService;
