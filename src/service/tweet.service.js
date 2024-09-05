import {
  TweetRepository,
  HashtagRepository,
  CommentRepository,
  LikeRepository,
} from "../repository/index.repository.js";
import { ServiceError, DatabaseError } from "../error/custom.error.js";
import { responseCodes } from "../utils/imports.util.js";
import { firebaseConfig, redisClient } from "../config/index.config.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const { StatusCodes } = responseCodes;

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
      throw new ServiceError(
        "Failed to delete images",
        "An error occurred while deleting images from storage",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async #deleteCommentsRecursively(comments) {
    for (const comment of comments) {
      await this.likeRepository.delete(comment._id);
      if (comment.comments && comment.comments.length > 0) {
        await this.#deleteCommentsRecursively(comment.comments);
      }
      await this.commentRepository.delete(comment._id);
    }
  }

  async createTweet(data) {
    try {
      // Extract hashtags from the tweet content
      const content = data.content;
      const extractHashtags = (content) => {
        const regex = /(?:^|\s)##?([0-9a-zA-Z_]+)(?=\s|$|[.,!?])/g;
        const matches = content.matchAll(regex);
        return Array.from(matches, (match) => match[1].toLowerCase());
      };

      const hashtags = extractHashtags(content);

      // Create the tweet
      const tweet = await this.tweetRepository.createTweet({
        content: content,
        images: data.images,
      });

      // Get the Existed Hashtags
      const existedHashtags = await this.hashtagRepository.getHashtags(
        hashtags
      );

      // Update the existed hashtags by pushing the new tweet id and not requirement to wait for the result
      const existedHashtagsNames = existedHashtags.map((tag) => tag.title);
      const existedHashtagsIds = existedHashtags.map((tag) => tag._id);
      await this.hashtagRepository.updateHashTags(existedHashtagsIds, {
        tweet: tweet._id,
      });

      // Create the new hashtags with the new tweet id
      const newHashtagsSet = new Set(
        hashtags.filter((tag) => !existedHashtagsNames.includes(tag))
      );
      const newHashtagsObjects = Array.from(newHashtagsSet).map((tag) => ({
        title: tag,
        tweets: [tweet._id],
      }));
      await this.hashtagRepository.createHashtags(newHashtagsObjects);

      const tweetReturn = {
        tweetId: tweet?._id,
        content: tweet?.content,
        images: tweet?.images,
        createdAt: tweet?.createdAt,
        updatedAt: tweet?.updatedAt,
      };

      // Cache the new tweet in Redis
      await redisClient.set(`tweet:${tweet._id}`, JSON.stringify(tweetReturn), {
        EX: 3600, // Expire after 1 hour
      });

      return tweetReturn;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to create tweet",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      throw new ServiceError(
        "Tweet creation failed",
        "An error occurred while creating the tweet",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async uploadImage(file) {
    try {
      const filename = `${Date.now()}_${file.originalname}`;
      const storageRef = ref(firebaseConfig.storage, `tweetImages/${filename}`);

      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file.buffer, {
        contentType: file.mimetype,
      });

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      throw new ServiceError(
        "Failed to upload image",
        "An error occurred while uploading the image",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTweetById(id) {
    try {
      const cachedTweet = await redisClient.get(`tweet:${id}`);
      if (cachedTweet) {
        return JSON.parse(cachedTweet);
      }

      // If not in Redis, get from database
      const tweet = await this.tweetRepository.getTweetById(id);
      if (!tweet) {
        throw new ServiceError(
          "Tweet not found",
          "The specified tweet does not exist",
          StatusCodes.NOT_FOUND
        );
      }

      const tweetReturn = {
        tweetId: tweet?._id,
        content: tweet?.content,
        countOfLikes: tweet?.countOfLikes,
        countOfComments: tweet?.countOfComments,
        images: tweet?.images,
        createdAt: tweet?.createdAt,
        updatedAt: tweet?.updatedAt,
      };

      // Cache the tweet in Redis
      await redisClient.set(`tweet:${id}`, JSON.stringify(tweetReturn), {
        EX: 3600, // Expire after 1 hour
      });

      return tweetReturn;
    } catch (error) {
      console.log(error);
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to retrieve tweet",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Tweet retrieval failed",
        "An error occurred while retrieving the tweet",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTweets() {
    try {
      return await this.tweetRepository.getTweets();
    } catch (error) {
      throw new ServiceError(
        "Failed to retrieve tweets",
        "An error occurred while retrieving tweets",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateTweet(id, tweetData) {
    try {
      const updatedTweet = await this.tweetRepository.updateTweet(
        id,
        tweetData
      );
      if (!updatedTweet) {
        throw new ServiceError(
          "Tweet not found",
          "The specified tweet does not exist",
          StatusCodes.NOT_FOUND
        );
      }
      return updatedTweet;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to update tweet",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Tweet update failed",
        "An error occurred while updating the tweet",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteTweet(id) {
    try {
      const tweet = await this.tweetRepository.getTweetById(id);
      if (!tweet) {
        throw new ServiceError(
          "Tweet not found",
          "The specified tweet does not exist",
          StatusCodes.NOT_FOUND
        );
      }

      // Delete images from Firebase Storage
      if (tweet.images && tweet.images.length > 0) {
        await this.#deleteImagesFromStorage(tweet.images);
      }

      // Get all comments associated with the tweet
      const commentsOfTweet = await this.commentRepository.getById({ _id: id });

      // Recursively delete comments and their likes
      await this.#deleteCommentsRecursively(commentsOfTweet);

      // Delete the tweet from the database
      await this.tweetRepository.deleteTweet(id);

      // Remove tweet reference from hashtags
      await this.hashtagRepository.removeTweetFromHashtags(id);

      // Delete the likes associated with the tweet
      await this.likeRepository.delete(id);

      // Remove the tweet from Redis cache
      await redisClient.del(`tweet:${id}`);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Failed to delete tweet",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Tweet deletion failed",
        "An error occurred while deleting the tweet",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default TweetService;
