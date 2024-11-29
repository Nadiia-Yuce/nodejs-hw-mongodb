import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parseContactFilterParams } from '../utils/parseContactFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/models/Contact.js';
import { env } from '../utils/env.js';

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

  let photo = req.file;
  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const data = await contactServices.addContact({
    ...req.body,
    userId,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId: _id } = req.params;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await contactServices.updateContact(
    { _id, userId: req.user._id },
    {
      ...req.body,
      photo: photoUrl,
    },
    {
      upsert: true,
    },
  );

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Contact successfully upserted',
    data: result,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId: _id } = req.params;
  const photo = req.file;
  // console.log(photo);
  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await contactServices.updateContact(
    {
      _id,
      userId: req.user._id,
    },
    { ...req.body, photo: photoUrl },
  );

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
