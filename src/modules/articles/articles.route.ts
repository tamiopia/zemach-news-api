import { Router } from 'express';
import { articleController } from './articles.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { rbacMiddleware } from '../../middlewares/rbac.middleware';
import { readLogLimiter } from '../../middlewares/rate-limiter.middleware';

const router = Router();

// Publicly accessible but filtered list
/**
 * @openapi
 * tags:
 *   name: Articles
 *   description: Public News Feed and Article Lifecycle
 * 
 * /articles:
 *   get:
 *     summary: Get a list of published articles
 *     tags: [Articles]
 */
router.get('/', (req, res) => { articleController.getPublicArticles(req, res); });

// Author only routes - MUST be before /:id to prevent matching 'me' as an id
/**
 * @openapi
 * /articles/me:
 *   get:
 *     summary: Get author's articles
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 * /articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Future of Technology
 *               content:
 *                 type: string
 *                 example: Artificial intelligence is rapidly evolving. We are looking at a future where machines will significantly improve our daily lives and optimize our workflows on an unprecedented scale.
 *               category:
 *                 type: string
 *                 example: Tech
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *                 example: PUBLISHED
 * /articles/{id}:
 *   put:
 *     summary: Update an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Updated Future of Technology
 *               content:
 *                 type: string
 *                 example: Updated content discussing the latest advancements in machine learning...
 *               category:
 *                 type: string
 *                 example: Tech
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *                 example: PUBLISHED
 *   delete:
 *     summary: Soft delete an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID
 */
router.post('/', authMiddleware, rbacMiddleware(['AUTHOR']), (req, res) => { articleController.create(req, res); });
router.get('/me', authMiddleware, rbacMiddleware(['AUTHOR']), (req, res) => { articleController.getMyArticles(req, res); });
router.put('/:id', authMiddleware, rbacMiddleware(['AUTHOR']), (req, res) => { articleController.update(req, res); });
router.delete('/:id', authMiddleware, rbacMiddleware(['AUTHOR']), (req, res) => { articleController.delete(req, res); });

// Article details, with rate limiter for abuse prevention, optional auth
// We apply an optional auth check to capture readerId if logged in
/**
 * @openapi
 * /articles/{id}:
 *   get:
 *     summary: Get article details by ID (Records a read)
 *     tags: [Articles]
 */
router.get('/:id', readLogLimiter, (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    authMiddleware(req, res, next);
  } else {
    next();
  }
}, (req, res) => { articleController.getArticleById(req, res); });

export default router;
