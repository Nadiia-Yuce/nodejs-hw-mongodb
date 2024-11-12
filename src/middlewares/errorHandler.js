export const errorHandler = (err, req, res, next) => {
  const { status = 500, message = 'Something went wrong', errors } = err;
  res.status(status).json({
    status,
    message,
    errors,
  });
};
