import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/Session.js';
import { UserCollection } from '../db/models/User.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader)
    next(createHttpError(401, 'Please provide Authorization header'));

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || token)
    next(createHttpError(401, 'Auth header should be of type Bearer'));

  const session = await SessionCollection.findOne({ accessToken: token });
  if (!session) next(createHttpError(401, 'Session not found'));

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired) next(createHttpError(401, 'Access token expired'));

  const user = await UserCollection.findById(session.userId);
  if (!user) next(createHttpError(401));

  req.user = user;

  next();
};
