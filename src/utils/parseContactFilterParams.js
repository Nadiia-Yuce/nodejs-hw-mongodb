const typeList = ['work', 'home', 'personal'];

const parseType = (type) => {
  if (typeof type !== 'string') return;
  if (typeList.includes(type)) return type;
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }

  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  if (value == null) return false;

  const error = new Error(
    `Parsing error: The value "${value}" is not a valid boolean.`,
  );
  error.code = 'ERR_INVALID_BOOLEAN';

  throw error;
};

export const parseContactFilterParams = ({ type, isFavourite }) => {
  return {
    type: parseType(type),
    isFavourite: parseBoolean(isFavourite),
  };
};
