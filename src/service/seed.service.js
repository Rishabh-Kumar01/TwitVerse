import { faker } from "@faker-js/faker";
import User from "../models/user.model.js";
import Tweet from "../models/tweet.model.js";
import Hashtag from "../models/hashtag.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import { ServiceError, DatabaseError } from "../error/custom.error.js";
import { responseCodes } from "../utils/imports.util.js";
const { StatusCodes } = responseCodes;

class SeedService {
  static getInstance() {
    if (!SeedService.instance) {
      SeedService.instance = new SeedService();
    }
    return SeedService.instance;
  }

  async seedData(count = 10) {
    try {
      const users = await this.seedUsers(count);
      const hashtags = await this.seedHashtags(Math.floor(count / 2));
      const tweets = await this.seedTweets(count * 2, users, hashtags);
      await this.seedComments(count * 3, users, tweets);
      await this.seedLikes(count * 5, users, tweets);

      return {
        users: count,
        hashtags: Math.floor(count / 2),
        tweets: count * 2,
        comments: count * 3,
        likes: count * 5,
      };
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new ServiceError(
          "Seeding failed",
          error.explanation,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      throw new ServiceError(
        "Seeding failed",
        "An error occurred while seeding the database",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async seedUsers(count) {
    try {
      const users = [];
      for (let i = 0; i < count; i++) {
        const user = new User({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        });
        users.push(await user.save());
      }
      return users;
    } catch (error) {
      throw new DatabaseError({
        explanation: "Failed to seed users",
        message: error.message,
      });
    }
  }

  async seedHashtags(count) {
    try {
      const hashtags = [];
      let attempts = 0;
      const maxAttempts = count * 2; // Allow more attempts to find unique hashtags

      while (hashtags.length < count && attempts < maxAttempts) {
        const title = faker.word.sample().toLowerCase();

        // Check if hashtag already exists
        const existingHashtag = await Hashtag.findOne({ title });

        if (!existingHashtag) {
          const hashtag = new Hashtag({ title });
          const savedHashtag = await hashtag.save();
          hashtags.push(savedHashtag);
        }

        attempts++;
      }

      if (hashtags.length < count) {
        console.warn(
          `Only ${hashtags.length} unique hashtags were created out of ${count} requested.`
        );
      }

      return hashtags;
    } catch (error) {
      console.log(error, "error");
      throw new DatabaseError({
        explanation: "Failed to seed hashtags",
        message: error.message,
      });
    }
  }

  async seedTweets(count, users, hashtags) {
    try {
      const tweets = [];
      for (let i = 0; i < count; i++) {
        const tweet = new Tweet({
          content: faker.lorem.sentence(),
          userId: faker.helpers.arrayElement(users)._id,
        });

        if (Math.random() > 0.5 && hashtags.length > 0) {
          const hashtag = faker.helpers.arrayElement(hashtags);
          tweet.content += ` #${hashtag.title}`;
          hashtag.tweets.push(tweet._id);
          await hashtag.save();
        }

        tweets.push(await tweet.save());
      }
      return tweets;
    } catch (error) {
      throw new DatabaseError({
        explanation: "Failed to seed tweets",
        message: error.message,
      });
    }
  }

  async seedComments(count, users, tweets) {
    try {
      for (let i = 0; i < count; i++) {
        const comment = new Comment({
          content: faker.lorem.sentence(),
          onModel: "Tweet",
          commentable: faker.helpers.arrayElement(tweets)._id,
          userId: faker.helpers.arrayElement(users)._id,
        });
        await comment.save();
      }
    } catch (error) {
      throw new DatabaseError({
        explanation: "Failed to seed comments",
        message: error.message,
      });
    }
  }

  async seedLikes(count, users, tweets) {
    try {
      for (let i = 0; i < count; i++) {
        const like = new Like({
          onModel: "Tweet",
          likeable: faker.helpers.arrayElement(tweets)._id,
          userId: faker.helpers.arrayElement(users)._id,
        });
        await like.save();
      }
    } catch (error) {
      throw new DatabaseError({
        explanation: "Failed to seed likes",
        message: error.message,
      });
    }
  }
}

export default SeedService;
