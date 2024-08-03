import CrudRepository from "./crud.repository.js";
import { Like } from "../models/index.js";

class LikeRepository extends CrudRepository {
  constructor() {
    super(Like);
  }

  static getInstance() {
    if (!LikeRepository.instance) {
      LikeRepository.instance = new LikeRepository();
    }
    return LikeRepository.instance;
  }

  async getByUserIdAndLikeable(userId, likeable) {
    try {
      const response = await Like.findOne({
        userId: userId,
        likeable: likeable,
      });

      return response;
    } catch (error) {
      console.log(
        error,
        "Error in Like Repository while getting by user id and tweet id"
      );
      throw new Error(
        `Error in Like Repository while getting by user id and tweet id: ${error}`
      );
    }
  }
}

export default LikeRepository;
