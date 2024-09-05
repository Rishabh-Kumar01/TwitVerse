import { User } from "../models/index.js";
import { passportJWT } from "../utils/imports.util.js";
import { serverConfig } from "./serverConfig.js";

const JWT = passportJWT;

const JwtStrategy = JWT.Strategy;
const ExtractJwt = JWT.ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: serverConfig.JWT_KEY,
};

export const passportAuth = (passport) => {
  try {
    passport.use(
      new JwtStrategy(opts, async (jwt_payload, done) => {
        const user = await User.findById(jwt_payload.id);
        if (!user) {
          done(null, false);
        } else {
          done(null, user);
        }
      })
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
