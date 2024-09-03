import CrudRepository from "./crud.repository.js";
import { Like } from "../models/index.js";
import { DatabaseError } from "../error/custom.error.js";

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
      throw new DatabaseError(error);
    }
  }

  async delete(id) {
    try {
      const deletedData = await Like.deleteMany({ likeable: id });
      return deletedData;
    } catch (error) {
      console.log(error, "Error in Like Repository while deleting");
      throw new DatabaseError(error);
    }
  }
}

export default LikeRepository;
