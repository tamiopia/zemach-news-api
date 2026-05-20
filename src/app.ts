import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './modules/auth/auth.route';
import articleRoutes from './modules/articles/articles.route';
import analyticsRoutes from './modules/analytics/analytics.route';

import { apiReference } from '@scalar/express-api-reference';
import { swaggerSpec } from './utils/swagger';
import pinoHttp from 'pino-http';
import logger from './utils/logger';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
        connectSrc: ["'self'"],
      },
    },
  })
);
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use('/docs', apiReference({
  spec: {
    content: swaggerSpec,
  },
}));

app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);
app.use('/author', analyticsRoutes);

export default app;
