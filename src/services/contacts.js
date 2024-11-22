import ContactCollection from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const query = ContactCollection.find();

  if (filter.type) {
    query.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite) {
    query.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.userId) {
    query.where('userId').equals(filter.userId);
  }

  const totalItems = await ContactCollection.find()
    .merge(query)
    .countDocuments();

  const skip = (page - 1) * perPage;

  const data = await query
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData({ totalItems, page, perPage });

  return {
    data,
    ...paginationData,
  };
};

export const getContactById = async ({ _id, userId }) =>
  await ContactCollection.findOne({ _id, userId });

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async ({ _id, userId, payload, options = {} }) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id, userId },
    payload,
    {
      ...options,
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContact = ({ filter, userId }) =>
  ContactCollection.findOneAndDelete({ filter, userId });
