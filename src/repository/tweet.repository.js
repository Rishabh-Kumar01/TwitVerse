import { Tweet } from "../models/index.js";
import CrudRepository from "./crud.repository.js";
import { DatabaseError } from "../error/custom.error.js";

class TweetRepository extends CrudRepository {
  constructor() {
    super(Tweet);
  }

  static getInstance() {
    if (!TweetRepository.instance) {
      TweetRepository.instance = new TweetRepository();
    }
    return TweetRepository.instance;
  }

  async createTweet(data) {
    try {
      console.log(data);
      const tweet = await Tweet.create({
        content: data.content,
        images: data.images,
      });
      return tweet;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async getTweetById(id) {
    try {
      return await Tweet.findById(id).read("secondary");
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async getTweets() {
    try {
      return await Tweet.find().read("secondary");
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async updateTweet(id, data) {
    try {
      const tweet = await Tweet.findOneAndUpdate(
        {
          _id: id,
        },
        data,
        { new: true }
      );
      return tweet;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async updateLikeCount(id, value) {
    try {
      const tweet = await Tweet.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $inc: { countOfLikes: value },
        },
        { new: true }
      );
      return tweet;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async deleteTweet(id) {
    try {
      return await Tweet.findByIdAndDelete({ _id: id });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
}

export default TweetRepository;
