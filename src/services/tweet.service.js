import {
  TweetRepository,
  HashtagRepository,
} from "../repository/index.repository.js";

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
    const extractHashtags = (content) => {
      const regex = /(?:^|\s)##?([0-9a-zA-Z_]+)(?=\s|$|[.,!?])/g;
      const matches = content.matchAll(regex);
      return Array.from(matches, (match) => match[1].toLowerCase());
    };

    const hashtags = extractHashtags(content);
    console.log(hashtags);

    // Create the tweet
    const tweet = await this.tweetRepository.createTweet({ content: content });

    // Get the Existed Hashtags
    const existedHashtags = await this.hashtagRepository.getHashtags(hashtags);

    // Update the existed hashtags with the new tweet id and not requirement to wait for the result
    const existedHashtagsNames = existedHashtags.map((tag) => tag.name);
    const existedHashtagsIds = existedHashtags.map((tag) => tag._id);
    this.hashtagRepository.updateHashTags(existedHashtagsIds, {
      tweet: tweet._id,
    });

    // Create the new hashtags with the new tweet id
    const newHashtagsSet = new Set(
      hashtags.filter((tag) => !existedHashtagsNames.includes(tag))
    );
    const newHashtagsObjects = Array.from(newHashtagsSet).map((tag) => ({
      name: tag,
      tweets: [tweet._id],
    }));
    const hashtagsCreated =
      this.hashtagRepository.createHashtags(newHashtagsObjects);

    return tweet;
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

export default TweetService;
