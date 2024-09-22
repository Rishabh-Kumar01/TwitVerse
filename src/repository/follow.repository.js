import { Follow } from "../models/index.js";
import CrudRepository from "./crud.repository.js";
import { DatabaseError } from "../error/custom.error.js";

class FollowRepository extends CrudRepository {
  constructor() {
    super(Follow);
  }

  static getInstance() {
    if (!FollowRepository.instance) {
      FollowRepository.instance = new FollowRepository();
    }
    return FollowRepository.instance;
  }

  async getFollow(followerId, followedId) {
    try {
      return await Follow.findOne({
        follower: followerId,
        followed: followedId,
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async getFollowers(userId) {
    try {
      return await Follow.find({ followed: userId }).select("-__v").populate(
        "follower",
        "name email"
      ).lean();
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async getFollowing(userId) {
    try {
      return await Follow.find({ follower: userId }).select("-__v").populate(
        "followed",
        "name email"
      ).lean();
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
}

export default FollowRepository;
