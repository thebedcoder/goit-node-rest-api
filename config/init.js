import sequelize from "./database.js";
import Contact from "../models/Contact.js";
import fs from "fs/promises";
import path from "path";

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");

    await sequelize.sync({ force: false }); // Set to true to drop tables on restart
    console.log("Database tables synchronized");

    await seedContacts();
  } catch (error) {
    console.error("Unable to initialize database:", error);
    process.exit(1);
  }
}

async function seedContacts() {
  try {
    const count = await Contact.count();
    if (count > 0) {
      console.log("Contacts already exist, skipping seed");
      return;
    }

    const contactsPath = path.join(process.cwd(), "db", "contacts.json");
    const contactsData = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(contactsData);

    await Contact.bulkCreate(contacts);
    console.log("Contacts seeded successfully");
  } catch (error) {
    console.error("Error seeding contacts:", error);
  }
}

export async function closeDatabase() {
  try {
    await sequelize.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database:", error);
  }
}
