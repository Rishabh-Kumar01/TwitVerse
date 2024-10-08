import { faker } from "@faker-js/faker";
import {
  User,
  Tweet,
  Hashtag,
  Comment,
  Like,
  Follow,
} from "../models/index.js";
import { ServiceError, DatabaseError } from "../error/custom.error.js";
import { responseCodes, mongoose } from "../utils/imports.util.js";
import { serverConfig } from "../config/serverConfig.js";
import fs from "fs/promises";
import path from "path";

const { StatusCodes } = responseCodes;

class SeedService {
  static getInstance() {
    if (!SeedService.instance) {
      SeedService.instance = new SeedService();
    }
    return SeedService.instance;
  }

  async seedData(count = 10) {
    const useTransaction = !!serverConfig.DATABASE_URL_REPLICA;
    let session;

    try {
      // Clean up before seeding
      await this.cleanup();

      if (useTransaction) {
        session = await mongoose.startSession();
        session.startTransaction();
      }

      const users = await this.seedUsers(count, session);
      const hashtags = await this.seedHashtags(Math.floor(count / 2), session);
      const tweets = await this.seedTweets(count * 2, users, hashtags, session);
      await this.seedComments(count * 3, users, tweets, session);
      await this.seedLikes(count * 5, users, tweets, session);
      await this.seedFollows(users, session);

      if (useTransaction) {
        await session.commitTransaction();
      }

      // Write user details to a file
      await this.writeUserDetailsToFile(users);

      return {
        users: users.length,
        hashtags: hashtags.length,
        tweets: tweets.length,
        comments: count * 3,
        likes: count * 5,
      };
    } catch (error) {
      if (useTransaction && session) {
        await session.abortTransaction();
      }
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
      if (session) {
        session.endSession();
      }
    }
  }

  async cleanup() {
    try {
      // Drop all collections
      const collections = Object.values(mongoose.connection.collections);
      for (const collection of collections) {
        await collection.drop();
      }
      console.log("All collections dropped successfully");

      // Clear seeded_users.json file if it exists
      const publicFolderPath = path.join(process.cwd(), "public");
      const filePath = path.join(publicFolderPath, "seeded_users.json");

      try {
        // Check if the public folder exists
        await fs.access(publicFolderPath);

        // Check if the file exists
        await fs.access(filePath);

        // If we reach here, both folder and file exist, so delete the file
        await fs.unlink(filePath);
        console.log("seeded_users.json file deleted successfully");
      } catch (error) {
        if (error.code === "ENOENT") {
          // ENOENT means file or folder doesn't exist, which is fine
          console.log(
            "seeded_users.json file or public folder does not exist, skipping deletion"
          );
        } else {
          console.error(
            "Error checking or deleting seeded_users.json file:",
            error
          );
        }
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
      throw new DatabaseError({
        explanation: "Failed to cleanup before seeding",
        message: error.message,
      });
    }
  }

  async seedUsers(count, session) {
    try {
      const users = [];
      for (let i = 0; i < count; i++) {
        const password = faker.internet.password();
        const user = new User({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: password,
        });
        const savedUser = await user.save({ session });
        users.push({ ...savedUser.toObject(), unencryptedPassword: password });
      }
      return users;
    } catch (error) {
      throw new DatabaseError({
        explanation: "Failed to seed users",
        message: error.message,
      });
    }
  }

  async seedFollows(users, session) {
    try {
      const followPromises = users.map(async (user) => {
        const maxFollows = users.length - 1; // Maximum is all other users
        const numToFollow = faker.number.int({ min: 1, max: maxFollows });
        const usersToFollow = faker.helpers.arrayElements(
          users.filter((u) => u._id.toString() !== user._id.toString()),
          numToFollow
        );

        for (const userToFollow of usersToFollow) {
          const follow = new Follow({
            follower: user._id,
            followed: userToFollow._id,
          });
          await follow.save({ session });

          await User.findByIdAndUpdate(
            user._id,
            { $inc: { followings: 1 } },
            { session, new: true }
          );
          await User.findByIdAndUpdate(
            userToFollow._id,
            { $inc: { followers: 1 } },
            { session, new: true }
          );
        }
      });

      await Promise.all(followPromises);
    } catch (error) {
      throw new DatabaseError({
        explanation: "Failed to seed follow relationships",
        message: error.message,
      });
    }
  }

  async writeUserDetailsToFile(users) {
    try {
      const userDetails = users.map((user) => ({
        name: user.name,
        email: user.email,
        password: user.unencryptedPassword,
      }));

      const fileContent = JSON.stringify(userDetails, null, 2);
      const publicFolderPath = path.join(process.cwd(), "public");
      const filePath = path.join(publicFolderPath, "seeded_users.json");

      // Create the public folder if it doesn't exist
      await fs.mkdir(publicFolderPath, { recursive: true });

      // Write the file
      await fs.writeFile(filePath, fileContent, "utf8");
      console.log(`User details written to ${filePath}`);
    } catch (error) {
      console.error("Failed to write user details to file:", error);
    }
  }

  async seedHashtags(count, session) {
    try {
      const hashtags = [];
      let attempts = 0;
      const maxAttempts = count * 2;

      while (hashtags.length < count && attempts < maxAttempts) {
        const title = faker.word.sample().toLowerCase();

        const query = Hashtag.findOne({ title });
        if (session) {
          query.session(session).read("primary");
        }
        const existingHashtag = await query;

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

        const query = Tweet.findByIdAndUpdate(
          tweet._id,
          { $inc: { countOfComments: 1 } },
          { new: true }
        );
        if (session) {
          query.session(session).read("primary");
        }
        await query;
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

        const query = Tweet.findByIdAndUpdate(
          tweet._id,
          { $inc: { countOfLikes: 1 } },
          { new: true }
        );
        if (session) {
          query.session(session).read("primary");
        }
        await query;
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
