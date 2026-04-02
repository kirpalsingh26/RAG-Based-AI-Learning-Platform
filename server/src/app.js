import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import apiRouter from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

const allowedOrigins = String(process.env.ALLOWED_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isLocalDevOrigin = (origin) =>
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(String(origin || ''));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
