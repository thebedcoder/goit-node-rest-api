import express from "express";
import morgan from "morgan";
import cors from "cors";

import "./config/jwt.js";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import storageRouter from "./routes/storageRouter.js";
import { avatarsDir } from "./config/storage.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);
app.use("/", storageRouter);

app.use("/public/avatars", express.static(avatarsDir));

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
