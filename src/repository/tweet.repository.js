import { Tweet } from "../models/index.js";

class TweetRepository {
  static getInstance() {
    if (!TweetRepository.instance) {
      TweetRepository.instance = new TweetRepository();
    }
    return TweetRepository.instance;
  }

  async createTweet(data) {
    const tweet = await Tweet.create({
      content: data.content,
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
    return Tweet.destroy({ where: { id } });
  }
}

export default TweetRepository;
