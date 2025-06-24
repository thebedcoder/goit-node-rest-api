import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import User from "../models/Users.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

const params = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true,
};

passport.use(
  new Strategy(params, async (req, payload, done) => {
    try {
      const user = await User.findByPk(payload.id);
      if (!user) {
        return done(HttpError(401), false);
      }

      const authHeader = req.headers["authorization"];
      const tokenFromRequest =
        authHeader && authHeader.startsWith("Bearer ")
          ? authHeader.replace("Bearer ", "")
          : null;
      if (!tokenFromRequest || user.token !== tokenFromRequest) {
        return done(HttpError(401), false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);
