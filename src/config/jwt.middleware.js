import {User} from '../models/index.js';
import {passportJWT} from "../utils/imports.util.js"
import { serverConfig } from './serverConfig.js';

const JWT = passportJWT

const JwtStrategy = JWT.Strategy;
const ExtractJwt = JWT.ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: serverConfig.JWT_KEY
}

export const passportAuth = (passport) => {
    try {
        console.log("inside strategy");;
        passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
            console.log("req sent to strategy");
            const user = await User.findById(jwt_payload.id);
            console.log(user, "User in strategy");
            if(!user) {
                done(null, false);
            } else {
                done(null, user);
            }
        }));
    } catch(err) {
        console.log(err);
        throw err;
    }
    
}