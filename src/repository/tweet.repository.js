import { Tweet } from "../models/index.js";
import CrudRepository from "./crud.repository.js";

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
    console.log(data);
    const tweet = await Tweet.create({
      content: data.content,
      images: data.images
    });
    return tweet;
  }

  async getTweetById(id) {
    return Tweet.findById(id);
  }

  async getTweets() {
    return Tweet.findAll();
  }

  async updateTweet(id, data) {
    const tweet = await Tweet.findOneAndUpdate(
      {
        _id: id,
      },
      data,
      { new: true }
    );
    return tweet;
  }

  async updateLikeCount(id, value) {
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
  }

  async deleteTweet(id) {
    return await Tweet.findByIdAndDelete({ _id: id });
  }
}

export default TweetRepository;
