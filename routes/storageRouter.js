import express from "express";
import { upload } from "../config/storage.js";

const storageRouter = express.Router();

storageRouter.post("/upload", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ avatar: req.file.path });
});

export default storageRouter; 