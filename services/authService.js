import User from "../models/Users.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

class AuthService {
  async register(email, password, avatarURL) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: hashedPassword,
        avatarURL,
      });

      return user;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error("Error verifying password:", error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  }

  async updateToken(id, token) {
    try {
      await User.update({ token }, { where: { id } });
    } catch (error) {
      console.error("Error updating token:", error);
      throw error;
    }
  }

  async logout(id) {
    try {
      await User.update({ token: null }, { where: { id } });
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  async updateSubscription(id, subscription) {
    try {
      await User.update({ subscription }, { where: { id } });
      const updatedUser = await User.findOne({
        where: { id },
        attributes: ["email", "subscription"],
      });
      return updatedUser;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  }

  async updateAvatar(id, avatarURL) {
    try {
      await User.update({ avatarURL }, { where: { id } });
      const updatedUser = await User.findOne({
        where: { id },
        attributes: ["avatarURL"],
      });
      return updatedUser;
    } catch (error) {
      console.error("Error updating avatar:", error);
      throw error;
    }
  }

  async generateVerificationToken(email) {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await User.update({ verificationToken }, { where: { email } });
    return verificationToken;
  }

  async verifyUser(verificationToken) {
    const user = await User.findOne({ where: { verificationToken } });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.verificationToken !== verificationToken) {
      throw new Error("Invalid verification token");
    }
    const { email } = user;
    await User.update(
      { verify: true, verificationToken: null },
      { where: { email } },
    );
    return user;
  }
}

export const authService = new AuthService();
