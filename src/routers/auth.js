import * as authControllers from '../controllers/auth.js';
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  logInUserSchema,
  registerUserSchema,
  resetEmailSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(authControllers.registerUserController),
);

router.post(
  '/login',
  validateBody(logInUserSchema),
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
  validateBody(resetEmailSchema),
  ctrlWrapper(authControllers.requestResetEmailController),
);
