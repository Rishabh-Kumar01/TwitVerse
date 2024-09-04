import { Hashtag } from "../models/index.js";
import { DatabaseError } from "../error/custom.error.js";

class HashtagRepository {
  static getInstance() {
    if (!HashtagRepository.instance) {
      HashtagRepository.instance = new HashtagRepository();
    }
    return HashtagRepository.instance;
  }

  async createHashtags(data) {
    try {
      const hashtags = await Hashtag.insertMany(data);
      return hashtags;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async getHashtagById(id) {
    try {
      return await Hashtag.findById(id);
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async getHashtags(data) {
    try {
      return await Hashtag.find({
        title: { $in: data },
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async updateHashTags(ids, data) {
    try {
      const hashtags = await Hashtag.updateMany(
        {
          _id: { $in: ids },
        },
        {
          $push: { tweets: data.tweet },
        },
        { new: true }
      );
      return hashtags;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async removeTweetFromHashtags(tweetId) {
    try {
      return await Hashtag.updateMany(
        {
          tweets: tweetId,
        },
        {
          $pull: { tweets: tweetId },
        }
      );
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
}

export default HashtagRepository;
