import express from "express";
import {
  register,
  login,
  logout,
  current,
  updateSubscription,
  updateAvatar,
  verify,
  resendVerificationEmail,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  userSchema,
  subscriptionSchema,
  emailSchema,
} from "../schemas/userSchemas.js";
import { upload } from "../config/storage.js";
import { auth } from "../helpers/auth.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(userSchema), register);
authRouter.post("/login", validateBody(userSchema), login);
authRouter.post("/logout", auth, logout);
authRouter.get("/current", auth, current);
authRouter.patch(
  "/subscription",
  auth,
  validateBody(subscriptionSchema),
  updateSubscription,
);
authRouter.patch("/avatars", auth, upload.single("avatar"), updateAvatar);
authRouter.get("/verify/:verificationToken", verify);
authRouter.post("/verify", validateBody(emailSchema), resendVerificationEmail);

export default authRouter;
