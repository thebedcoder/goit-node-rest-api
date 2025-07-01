import Contact from "../models/Contact.js";

class ContactsService {
  async listContacts(owner, page, limit, favorite) {
    try {
      const whereClause = { owner };

      if (favorite !== undefined) {
        whereClause.favorite = favorite;
      }

      const contacts = await Contact.findAll({
        where: whereClause,
        raw: true,
        order: [["createdAt", "DESC"]],
        limit,
        offset: (page - 1) * limit,
      });
      return contacts;
    } catch (error) {
      console.error("Error listing contacts:", error);
      throw error;
    }
  }

  async getContactById(contactId, owner) {
    try {
      const contact = await Contact.findOne({
        where: { id: contactId, owner },
      });
      return contact ? contact.toJSON() : null;
    } catch (error) {
      console.error("Error fetching contact:", error);
      throw error;
    }
  }

  async removeContact(contactId, owner) {
    try {
      const contact = await Contact.findOne({
        where: { id: contactId, owner },
      });

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

  async addContact(name, email, phone, owner) {
    try {
      const newContact = await Contact.create({
        name,
        email,
        phone,
        owner,
      });

      return newContact.toJSON();
    } catch (error) {
      console.error("Error adding contact:", error);
      throw error;
    }
  }

  async updateContact(contactId, updateData, owner) {
    try {
      const contact = await Contact.findOne({
        where: { id: contactId, owner },
      });

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

  async updateStatusContact(contactId, favorite, owner) {
    try {
      const contact = await Contact.findOne({
        where: { id: contactId, owner },
      });

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
