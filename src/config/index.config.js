import dbConnect from "./db.config.js";
import { serverConfig } from "./serverConfig.js";
import { passportAuth } from "./jwt.middleware.js";
import * as firebaseConfig from "./firebase.config.js";
import multerUpload from "./multer.config.js";
import * as swaggerConfig from "./swagger.config.js";
import { redisClient } from "./redis.config.js";

export {
  serverConfig,
  dbConnect,
  passportAuth,
  firebaseConfig,
  multerUpload,
  swaggerConfig,
  redisClient,
};
