import { faker } from "@faker-js/faker";
import User from "../models/user.model.js";
import Tweet from "../models/tweet.model.js";
import Hashtag from "../models/hashtag.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import { ServiceError, DatabaseError } from "../error/custom.error.js";
import { responseCodes, mongoose } from "../utils/imports.util.js";
const { StatusCodes } = responseCodes;

class SeedService {
  static getInstance() {
    if (!SeedService.instance) {
      SeedService.instance = new SeedService();
    }
    return SeedService.instance;
  }

  async seedData(count = 10) {
    const session = await mongoose.startSession();

    try {
      return await session.withTransaction(async () => {
        const users = await this.seedUsers(count, session);
        const hashtags = await this.seedHashtags(
          Math.floor(count / 2),
          session
        );
        const tweets = await this.seedTweets(
          count * 2,
          users,
          hashtags,
          session
        );
        await this.seedComments(count * 3, users, tweets, session);
        await this.seedLikes(count * 5, users, tweets, session);

        return {
          users: users.length,
          hashtags: hashtags.length,
          tweets: tweets.length,
          comments: count * 3,
          likes: count * 5,
        };
      });
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
    } finally {
      session.endSession();
    }
  }
  async seedUsers(count, session) {
    try {
      const users = [];
      for (let i = 0; i < count; i++) {
        const user = new User({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        });
        users.push(await user.save({ session }));
      }
      return users;
    } catch (error) {
      throw new DatabaseError({
        explanation: "Failed to seed users",
        message: error.message,
      });
    }
  }

  async seedHashtags(count, session) {
    try {
      const hashtags = [];
      let attempts = 0;
      const maxAttempts = count * 2;

      while (hashtags.length < count && attempts < maxAttempts) {
        const title = faker.word.sample().toLowerCase();

        const existingHashtag = await Hashtag.findOne({ title }).session(
          session
        );

        if (!existingHashtag) {
          const hashtag = new Hashtag({ title });
          const savedHashtag = await hashtag.save({ session });
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
      throw new DatabaseError({
        explanation: "Failed to seed hashtags",
        message: error.message,
      });
    }
  }

  async seedTweets(count, users, hashtags, session) {
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
          await hashtag.save({ session });
        }

        tweets.push(await tweet.save({ session }));
      }
      return tweets;
    } catch (error) {
      throw new DatabaseError({
        explanation: "Failed to seed tweets",
        message: error.message,
      });
    }
  }

  async seedComments(count, users, tweets, session) {
    try {
      for (let i = 0; i < count; i++) {
        const tweet = faker.helpers.arrayElement(tweets);
        const comment = new Comment({
          content: faker.lorem.sentence(),
          onModel: "Tweet",
          commentable: tweet._id,
          userId: faker.helpers.arrayElement(users)._id,
        });
        await comment.save({ session });

        await Tweet.findByIdAndUpdate(
          tweet._id,
          { $inc: { countOfComments: 1 } },
          { session }
        );
      }
    } catch (error) {
      throw new DatabaseError({
        explanation: "Failed to seed comments",
        message: error.message,
      });
    }
  }

  async seedLikes(count, users, tweets, session) {
    try {
      for (let i = 0; i < count; i++) {
        const tweet = faker.helpers.arrayElement(tweets);
        const like = new Like({
          onModel: "Tweet",
          likeable: tweet._id,
          userId: faker.helpers.arrayElement(users)._id,
        });
        await like.save({ session });

        await Tweet.findByIdAndUpdate(
          tweet._id,
          { $inc: { countOfLikes: 1 } },
          { session }
        );
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
