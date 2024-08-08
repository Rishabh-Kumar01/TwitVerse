import {
  TweetRepository,
  HashtagRepository,
  CommentRepository,
  LikeRepository
} from "../repository/index.repository.js";
import { ref, uploadBytes, getDownloadURL , deleteObject} from 'firebase/storage';
import { firebaseConfig } from "../config/index.config.js";

class TweetService {
  constructor() {
    this.tweetRepository = TweetRepository.getInstance();
    this.hashtagRepository = HashtagRepository.getInstance();
    this.commentRepository = CommentRepository.getInstance();
    this.likeRepository = LikeRepository.getInstance();
  }

  static getInstance() {
    if (!TweetService.instance) {
      TweetService.instance = new TweetService();
    }
    return TweetService.instance;
  }

  async #deleteImagesFromStorage(imageUrls) {
    try {
      const deletePromises = imageUrls.map(async (url) => {
        const imageRef = ref(firebaseConfig.storage, url);
        await deleteObject(imageRef);
      });
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting images from storage:', error);
      throw new Error('Failed to delete images from storage');
    }
  }

  async #deleteCommentsRecursively(comments) {
    for (const comment of comments) {
      // Delete likes associated with this comment
      await this.likeRepository.delete(comment._id);
  
      // Recursively delete nested comments
      if (comment.comments && comment.comments.length > 0) {
        await this.#deleteCommentsRecursively(comment.comments);
      }
  
      // Delete the comment itself
      await this.commentRepository.delete(comment._id);
    }
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
    const tweet = await this.tweetRepository.createTweet({ content: content, images: data.images});

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

    return {
      id: tweet._id,
      content: tweet.content,
      images: tweet.images,
      createdAt: tweet.createdAt,
      updatedAt: tweet.updatedAt,
    };
  }

  async uploadImage (file) {
    try {
      const filename = `${Date.now()}_${file.originalname}`;
      const storageRef = ref(firebaseConfig.storage, `tweetImages/${filename}`);
      
      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file.buffer, {
        contentType: file.mimetype,
      });
      console.log('File uploaded to Firebase Storage:', snapshot);
      // Get the public download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('File available at:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

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
    try {
      const tweet = await this.tweetRepository.getTweetById(id);
      if (!tweet) {
        throw new Error('Tweet not found');
      }
  
      // Delete images from Firebase Storage
      if (tweet.images && tweet.images.length > 0) {
        await this.#deleteImagesFromStorage(tweet.images);
      }
  
      // Get all comments associated with the tweet
      const commentsOfTweet = await this.commentRepository.getById({_id: id});
  
      // Recursively delete comments and their likes
      await this.#deleteCommentsRecursively(commentsOfTweet);
  
      // Delete the tweet from the database
      await this.tweetRepository.deleteTweet(id);
  
      // Remove tweet reference from hashtags
      await this.hashtagRepository.removeTweetFromHashtags(id);
  
      // Delete the likes associated with the tweet
      await this.likeRepository.delete(id);
  
      return { message: 'Tweet and all associated data deleted successfully' };
  
    } catch (error) {
      console.error('Error deleting tweet:', error);
      throw new Error('Failed to delete tweet');
    }
  }
  
  
}

export default TweetService;
