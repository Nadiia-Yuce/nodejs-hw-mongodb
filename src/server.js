import cors from 'cors';
import express from 'express';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
// import { logger } from './middlewares/logger.js';
import { env } from './utils/env.js';
import { UPLOAD_DIR } from './constants/index.js';

export function setupServer() {
  const app = express();

  // app.use(logger);

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use(router);
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  const PORT = Number(env('PORT', 3000));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
