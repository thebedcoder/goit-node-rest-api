import { authService } from "../services/authService.js";
import { fileService } from "../services/fileService.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { mailTransporter } from "../config/mail.js";

const { JWT_SECRET } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const registeredUser = await authService.getUserByEmail(email);
    if (registeredUser) {
      throw HttpError(409, "Email in use");
    }
    const avatarURL = gravatar.url(email, { s: "250", protocol: "https" });
    const user = await authService.register(email, password, avatarURL);
    const verificationToken = await authService.generateVerificationToken(
      email,
    );
    await sendVerificationEmail(email, verificationToken);
    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.getUserByEmail(email);
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    const isPasswordValid = await authService.verifyPassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw HttpError(401, "Email or password is wrong");
    }
    if (!user.verify) {
      throw HttpError(401, "Email not verified");
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });
    await authService.updateToken(user.id, token);
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    await authService.logout(id);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { subscription } = req.body;
    const updatedUser = await authService.updateSubscription(id, subscription);
    res.status(200).json({
      user: {
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { file } = req;
    const newPath = await fileService.moveFile(file, `public/avatars/${id}`);
    const avatarPath = newPath.replace("public/", "");
    const { avatarURL } = await authService.updateAvatar(id, avatarPath);
    res.status(200).json({ avatarURL: `${process.env.BASE_URL}/${avatarURL}` });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    await authService.verifyUser(verificationToken);
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authService.getUserByEmail(email);
    if (!user) {
      throw HttpError(401, "Email not found");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
    await sendVerificationEmail(email, user.verificationToken);
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Click the link to verify your email: ${verificationLink}`,
  };
  await mailTransporter.sendMail(mailOptions);
};
