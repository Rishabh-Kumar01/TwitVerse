import { dotenv } from "../utils/imports.util.js";

dotenv.config();

export const serverConfig = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
};
