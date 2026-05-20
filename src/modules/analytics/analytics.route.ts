import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { rbacMiddleware } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authMiddleware);
router.use(rbacMiddleware(['AUTHOR']));

/**
 * @openapi
 * tags:
 *   name: Author
 *   description: Author Performance and Analytics
 * 
 * /author/dashboard:
 *   get:
 *     summary: Get author's performance dashboard
 *     tags: [Author]
 *     security:
 *       - bearerAuth: []
 */
router.get('/dashboard', (req, res) => { analyticsController.getDashboard(req, res); });

export default router;
