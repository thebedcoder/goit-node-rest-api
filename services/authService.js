import User from "../models/Users.js";
import bcrypt from "bcrypt";

class AuthService {
  async register(email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword });

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
}

export const authService = new AuthService();
