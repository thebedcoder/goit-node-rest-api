import fs from "fs/promises";
import path from "path";

const contactsPath = path.join(process.cwd(), "db", "contacts.json");

class ContactsService {
  constructor() {
    this.contactsPath = contactsPath;
  }

  async readContactsFile() {
    try {
      const data = await fs.readFile(this.contactsPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading contacts file:", error);
      return [];
    }
  }

  async listContacts() {
    try {
      const contacts = await this.readContactsFile();
      return contacts;
    } catch (error) {
      console.error("Error listing contacts:", error);
      return [];
    }
  }

  async getContactById(contactId) {
    const contacts = await this.readContactsFile();
    const contact = contacts.find((c) => c.id === contactId);
    return contact || null;
  }

  async removeContact(contactId) {
    try {
      const contacts = await this.readContactsFile();
      const index = contacts.findIndex((c) => c.id === contactId);

      if (index === -1) {
        return null; // Контакт не знайдено
      }

      const [removedContact] = contacts.splice(index, 1);
      await fs.writeFile(this.contactsPath, JSON.stringify(contacts, null, 2));
      return removedContact;
    } catch (error) {
      console.error("Error removing contact:", error);
      return null;
    }
  }

  async addContact(name, email, phone) {
    try {
      const contacts = await this.readContactsFile();
      const newContact = {
        id: Date.now().toString(),
        name,
        email,
        phone,
      };

      contacts.push(newContact);
      await fs.writeFile(this.contactsPath, JSON.stringify(contacts, null, 2));
      return newContact;
    } catch (error) {
      console.error("Error adding contact:", error);
      return null;
    }
  }

  async updateContact(contactId, updateData) {
    try {
      const contacts = await this.readContactsFile();
      const index = contacts.findIndex((c) => c.id === contactId);

      if (index === -1) {
        return null; // Контакт не знайдено
      }

      const updatedContact = { ...contacts[index], ...updateData };
      contacts[index] = updatedContact;
      await fs.writeFile(this.contactsPath, JSON.stringify(contacts, null, 2));
      return updatedContact;
    } catch (error) {
      console.error("Error updating contact:", error);
      return null;
    }
  }
}

export const contactsService = new ContactsService();
