import { contactsService } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (!contact) {
      throw HttpError(404);
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedContact = await contactsService.removeContact(id);

    if (!removedContact) {
      throw HttpError(404, "Contact not found");
    }

    return res.status(200).json(removedContact);
  } catch (error) {
    console.error("Error deleting contact:", error);
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await contactsService.addContact(name, email, phone);

    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error creating contact:", error);
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
      throw HttpError(400, "Body must have at least one field");
    }

    const updatedContact = await contactsService.updateContact(id, req.body);

    if (!updatedContact) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    next(error);
  }
};

export const updateFavoriteStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    const updatedContact = await contactsService.updateStatusContact(
      id,
      favorite,
    );

    if (!updatedContact) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact status:", error);
    next(error);
  }
};
