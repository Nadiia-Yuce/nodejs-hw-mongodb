import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { logInUserSchema, registerUserSchema } from '../validation/auth.js';
import {
  logInUserController,
  registerUserController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(logInUserSchema),
  ctrlWrapper(logInUserController),
);

export default router;
