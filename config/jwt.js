import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import User from "../models/Users.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

const params = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id);
      if (!user || user.token !== payload.token) {
        return done(new HttpError(401), false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);
