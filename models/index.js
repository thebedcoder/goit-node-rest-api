import sequelize from "../config/database.js";
import User from "./Users.js";
import Contact from "./Contact.js";

const models = {
  User,
  Contact,
  sequelize,
};

export default models;
