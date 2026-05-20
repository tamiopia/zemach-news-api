import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './modules/auth/auth.route';
import articleRoutes from './modules/articles/articles.route';
import analyticsRoutes from './modules/analytics/analytics.route';

import { apiReference } from '@scalar/express-api-reference';
import { swaggerSpec } from './utils/swagger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/docs', apiReference({
  spec: {
    content: swaggerSpec,
  },
}));

app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);
app.use('/author', analyticsRoutes);

export default app;
