const {
  TweetRepository,
  HashtagRepository,
} = require("../repository/index.repository");

class TweetService {
  constructor() {
    this.tweetRepository = TweetRepository.getInstance();
    this.hashtagRepository = HashtagRepository.getInstance();
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
    const hashtags = content.match(/#[0-9a-zA-Z_]+/g);
    const tags = hashtags.map((tag) => tag.substring(1));

    // Create the tweet
    const tweet = await this.tweetRepository.createTweet({ content: content });

    // Get the Existed Hashtags
    const existedHashtags = await this.hashtagRepository.getHashtags(tags);

    // Update the existed hashtags with the new tweet id
    const existedHashtagsNames = existedHashtags.map((tag) => tag.name);
    const existedHashtagsIds = existedHashtags.map((tag) => tag._id);
    await this.hashtagRepository.updateHashTags(existedHashtagsIds, {
      tweet: tweet._id,
    });

    // Create the new hashtags with the new tweet id
    const newHashtags = tags.filter(
      (tag) => !existedHashtagsNames.includes(tag)
    );
    const newHashtagsObjects = newHashtags.map((tag) => ({
      name: tag,
      tweets: [tweet._id],
    }));
    const createdHashtags = await this.hashtagRepository.createHashtags(
      newHashtagsObjects
    );

    // Update the tweet with the hashtag ids
    let hashtagIds = existedHashtags.map((tag) => tag._id);
    hashtagIds = hashtagIds.concat(createdHashtags.map((tag) => tag._id));
    const updatedTweet = await this.tweetRepository.updateTweet(tweet._id, {
      hashtags: hashtagIds,
    });
    return updatedTweet;
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
