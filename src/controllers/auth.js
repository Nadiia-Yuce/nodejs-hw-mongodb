import * as authServices from '../services/auth.js';
import { ONE_DAY } from '../constants/users.js';

export const registerUserController = async (req, res) => {
  const user = await authServices.registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const logInUserController = async (req, res) => {
  const session = await authServices.logInUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logOutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await authServices.logOutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

const setUpSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await authServices.refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setUpSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const requestResetEmailController = async (req, res) => {
  await authServices.requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  const sessionId = req.cookies.sessionId;

  await authServices.resetPassword(req.body, sessionId);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
