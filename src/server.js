import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';

export function setupServer() {
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());

  //   app.use('/', (req, res) => {
  //     res.json({
  //       message: 'Hello World!',
  //     });
  //   });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  const PORT = Number(env('PORT', 3000));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
