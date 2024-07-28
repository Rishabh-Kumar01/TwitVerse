const { Tweet } = require("../models/index");

class TweetRepository {
  static getInstance() {
    if (!TweetRepository.instance) {
      TweetRepository.instance = new TweetRepository();
    }
    return TweetRepository.instance;
  }

  async createTweet(data) {
    return Tweet.create({
      content: data.content,
    });
  }

  async getTweetById(id) {
    return Tweet.findByPk(id);
  }

  async getTweets() {
    return Tweet.findAll();
  }

  async updateTweet(id, tweet) {
    return Tweet.update(tweet, { where: { id } });
  }

  async deleteTweet(id) {
    return Tweet.destroy({ where: { id } });
  }
}

module.exports = TweetRepository;
