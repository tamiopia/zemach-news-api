import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { analyticsService } from './analytics.service';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response';

export class AnalyticsController {
  async getDashboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await analyticsService.getAuthorDashboard(req.user!.id, page, limit);
      res.status(200).json(paginatedResponse('Author dashboard retrieved.', result.items, page, limit, result.total));
    } catch (err: any) {
      res.status(500).json(errorResponse('Internal server error.', [err.message]));
    }
  }
}

export const analyticsController = new AnalyticsController();
