import { Router } from 'express';
import { articleController } from './articles.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { rbacMiddleware } from '../../middlewares/rbac.middleware';
import { readLogLimiter } from '../../middlewares/rate-limiter.middleware';

const router = Router();

// Publicly accessible but filtered list
router.get('/', (req, res) => { articleController.getPublicArticles(req, res); });

// Author only routes - MUST be before /:id to prevent matching 'me' as an id
router.post('/', authMiddleware, rbacMiddleware(['AUTHOR']), (req, res) => { articleController.create(req, res); });
router.get('/me', authMiddleware, rbacMiddleware(['AUTHOR']), (req, res) => { articleController.getMyArticles(req, res); });
router.put('/:id', authMiddleware, rbacMiddleware(['AUTHOR']), (req, res) => { articleController.update(req, res); });
router.delete('/:id', authMiddleware, rbacMiddleware(['AUTHOR']), (req, res) => { articleController.delete(req, res); });

// Article details, with rate limiter for abuse prevention, optional auth
// We apply an optional auth check to capture readerId if logged in
router.get('/:id', readLogLimiter, (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    authMiddleware(req, res, next);
  } else {
    next();
  }
}, (req, res) => { articleController.getArticleById(req, res); });

export default router;
