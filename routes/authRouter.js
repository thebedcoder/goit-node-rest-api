import express from "express";
import { register, login, logout, current, updateSubscription } from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSchema, subscriptionSchema } from "../schemas/userSchemas.js";
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

export default authRouter;
