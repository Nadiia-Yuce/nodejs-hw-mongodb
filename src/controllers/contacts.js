import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseContactFilterParams } from '../utils/parseContactFilterParams.js';
import { sortByList } from '../db/models/Contact.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = parseContactFilterParams(req.query);
  const { _id: userId } = req.user._id;
  filter.userId = userId;

  const data = await contactServices.getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const data = await contactServices.getContactById({
    _id: contactId,
    userId: req.user._id,
  });

  if (!data) {
    throw createHttpError(404, 'Contact not found');
    //   const error = new Error('Contact not found');
    //   error.status = 404;
    //   throw error;
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;

  const data = await contactServices.addContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId: _id } = req.params;
  const result = await contactServices.updateContact({
    _id,
    userId: req.user._id,
    payload: req.body,
    options: {
      upsert: true,
    },
  });

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Contact successfully upserted',
    data: result,
  });

  // console.log(req.body);
};

export const patchContactController = async (req, res) => {
  const { contactId: _id } = req.params;
  const result = await contactServices.updateContact({
    _id,
    userId: req.user._id,
    payload: req.body,
  });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId: _id } = req.params;
  const data = await contactServices.deleteContact({
    _id,
    userId: req.user._id,
  });

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
