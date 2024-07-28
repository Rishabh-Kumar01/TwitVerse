const { TweetRepository } = require("../repository/index.repository");

class TweetService {
  constructor() {
    this.tweetRepository = TweetRepository.getInstance();
  }

  static getInstance() {
    if (!TweetService.instance) {
      TweetService.instance = new TweetService();
    }
    return TweetService.instance;
  }

  async createTweet(data) {
    // Separate HashTags from the content
    const content = data.content;
    const hashtags = data.match(/#(0-9a-zA-Z_)+/g);
    const tags = hashtags.map((tag) => tag.substring(1));

    // Create the tweet
    const tweet = this.tweetRepository.createTweet(content);

    // Create the hashtags
  }

  async getTweetById(id) {
    return this.tweetRepository.getInstance().getTweetById(id);
  }

  async getTweets() {
    return this.tweetRepository.getInstance().getTweets();
  }

  async updateTweet(id, tweet) {
    return this.tweetRepository.getInstance().updateTweet(id, tweet);
  }

  async deleteTweet(id) {
    return this.tweetRepository.getInstance().deleteTweet(id);
  }
}

module.exports = TweetService;
