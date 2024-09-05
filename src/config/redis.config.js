import { redis } from "../utils/imports.util.js";
import { serverConfig } from "./serverConfig.js";

const { createClient } = redis;

class RedisClient {
  constructor() {
    this.client = null;
  }

  async connect() {
    this.client = createClient({
      url: serverConfig.REDIS_URL || "redis://localhost:6379",
    });

    this.client.on("error", (err) => console.log("Redis Client Error", err));

    await this.client.connect();

    console.log("Connected to Redis");
  }

  async get(key) {
    console.log(key, "key");
    return await this.client.get(key);
  }

  async set(key, value, options) {
    return await this.client.set(key, value, options);
  }

  async del(key) {
    return await this.client.del(key);
  }
}

const redisClient = new RedisClient();

export { redisClient };
