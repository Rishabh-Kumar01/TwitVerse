import { dotenv, bcrypt } from "../utils/imports.util.js";

dotenv.config();

export const serverConfig = {
  PORT: process.env.PORT,
  SALT: bcrypt.genSaltSync(10),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_KEY: process.env.JWT_KEY,
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
};
