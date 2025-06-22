import passport from "passport";
import HttpError from "./HttpError.js";

export const auth = (req, res, next) =>
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      throw HttpError(401);
    }
    req.user = user;
    next();
  })(req, res, next);
