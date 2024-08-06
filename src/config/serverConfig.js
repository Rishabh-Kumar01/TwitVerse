import { dotenv, bcrypt } from "../utils/imports.util.js";

dotenv.config();

export const serverConfig = {
  PORT: process.env.PORT,
  SALT: bcrypt.genSaltSync(10),
  DATABASE_URL: process.env.DATABASE_URL,
};
