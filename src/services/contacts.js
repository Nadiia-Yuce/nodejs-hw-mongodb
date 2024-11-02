import ContactCollection from '../db/models/Contact.js';

export const getAllContacts = () => ContactCollection.find();

export const getContactById = (id) => ContactCollection.findById(id);

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (_id, payload, options = {}) => {
  const data = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    ...options,
    new: true,
  });
  return data;
};
