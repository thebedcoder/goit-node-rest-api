import Contact from "../models/Contact.js";

class ContactsService {
  async listContacts() {
    try {
      const contacts = await Contact.findAll({
        order: [["createdAt", "DESC"]],
      });
      return contacts.map((contact) => contact.toJSON());
    } catch (error) {
      console.error("Error listing contacts:", error);
      throw error;
    }
  }

  async getContactById(contactId) {
    try {
      const contact = await Contact.findByPk(contactId);
      return contact ? contact.toJSON() : null;
    } catch (error) {
      console.error("Error fetching contact:", error);
      throw error;
    }
  }

  async removeContact(contactId) {
    try {
      const contact = await Contact.findByPk(contactId);

      if (!contact) {
        return null;
      }

      const contactData = contact.toJSON();
      await contact.destroy();
      return contactData;
    } catch (error) {
      console.error("Error removing contact:", error);
      throw error;
    }
  }

  async addContact(name, email, phone) {
    try {
      const newContact = await Contact.create({
        id: Date.now().toString(),
        name,
        email,
        phone,
      });

      return newContact.toJSON();
    } catch (error) {
      console.error("Error adding contact:", error);
      throw error;
    }
  }

  async updateContact(contactId, updateData) {
    try {
      const contact = await Contact.findByPk(contactId);

      if (!contact) {
        return null;
      }

      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(
          ([key, value]) => value !== undefined,
        ),
      );

      if (Object.keys(filteredUpdateData).length === 0) {
        return contact.toJSON();
      }

      await contact.update(filteredUpdateData);
      return contact.toJSON();
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  }
  async updateStatusContact(contactId, favorite) {
    try {
      const contact = await Contact.findByPk(contactId);

      if (!contact) {
        return null;
      }

      await contact.update({ favorite });
      return contact.toJSON();
    } catch (error) {
      console.error("Error updating contact status:", error);
      throw error;
    }
  }
}

export const contactsService = new ContactsService();
