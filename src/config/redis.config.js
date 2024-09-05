import { redis } from "../utils/imports.util.js";
import { serverConfig } from "./serverConfig.js";

const { createClient } = redis;

let redisClient;

const redisConnect = async () => {
  try {
    redisClient = createClient({
      url: serverConfig.REDIS_URL || "redis://localhost:6379",
    });

    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    await redisClient.connect();

    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
};

export { redisClient, redisConnect };
