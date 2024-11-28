import * as authControllers from '../controllers/auth.js';
import * as authSchemes from '../validation/auth.js';
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post(
  '/register',
  validateBody(authSchemes.registerUserSchema),
  ctrlWrapper(authControllers.registerUserController),
);

router.post(
  '/login',
  validateBody(authSchemes.logInUserSchema),
  ctrlWrapper(authControllers.logInUserController),
);

export default router;

router.post('/logout', ctrlWrapper(authControllers.logOutUserController));

router.post(
  '/refresh',
  ctrlWrapper(authControllers.refreshUserSessionController),
);

router.post(
  '/send-reset-email',
  validateBody(authSchemes.resetEmailSchema),
  ctrlWrapper(authControllers.requestResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(authSchemes.resetPasswordSchema),
  ctrlWrapper(authControllers.resetPasswordController),
);

router.get(
  '/get-oauth-url',
  ctrlWrapper(authControllers.getGoogleOAuthUrlController),
);

router.post(
  '/confirm-oauth',
  validateBody(authSchemes.loginWithGoogleOAuthSchema),
  ctrlWrapper(authControllers.loginWithGoogleController),
);
