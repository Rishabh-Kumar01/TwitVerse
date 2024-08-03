import {
  LikeRepository,
  TweetRepository,
} from "../repository/index.repository.js";
import CrudService from "./crud.service.js";

class LikeService extends CrudService {
  constructor() {
    const likeRepository = LikeRepository.getInstance();
    super(likeRepository);
    this.tweetRepository = TweetRepository.getInstance();
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
      const tweet = await this.tweetRepository.getTweetById(data.likeable);
      if (!tweet) {
        throw new Error("Tweet does not exist");
      }

      // Check if the like already exists
      const isExists = await this.repository.getByUserIdAndLikeable(
        data.userId,
        data.likeable
      );
      console.log(isExists, "IsExists in Like Service while toggling like");
      if (isExists) {
        // If like exists, delete it and reduce the like count by 1 from tweet

        const response = await this.repository.delete(isExists._id);
        if (response.deletedCount === 0) {
          throw new Error("Like not deleted");
        }
        await this.tweetRepository.updateLikeCount(data.likeable, -1);
        return {
          action: "unliked",
          like: {
            userId: data.userId,
            likeable: data.likeable,
            onModel: data.onModel,
          },
        };
      } else {
        // If like does not exist, create it and increase the like count by 1 from tweet

        const response = await this.repository.create(data);
        if (!response) {
          throw new Error("Like not created");
        }
        await this.tweetRepository.updateLikeCount(data.likeable, 1);
        return {
          action: "liked",
          like: {
            id: response._id,
            userId: response.userId,
            likeable: response.likeable,
            onModel: response.onModel,
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
