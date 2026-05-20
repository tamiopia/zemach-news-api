import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { articleService } from './articles.service';
import { CreateArticleSchema, UpdateArticleSchema } from './articles.schema';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response';
import { ZodError } from 'zod';

export class ArticleController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = CreateArticleSchema.parse(req.body);
      const article = await articleService.createArticle(req.user!.id, data);
      res.status(201).json(successResponse('Article created successfully.', article));
    } catch (err: any) {
      if (err instanceof ZodError) {
        res.status(400).json(errorResponse('Validation error.', err.errors.map(e => e.message)));
        return;
      }
      res.status(500).json(errorResponse('Internal server error.', [err.message]));
    }
  }

  async getMyArticles(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await articleService.getAuthorArticles(req.user!.id, page, limit);
      res.status(200).json(paginatedResponse('Author articles retrieved.', result.items, page, limit, result.total));
    } catch (err: any) {
      res.status(500).json(errorResponse('Internal server error.', [err.message]));
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const data = UpdateArticleSchema.parse(req.body);
      const article = await articleService.updateArticle(id, req.user!.id, data);
      res.status(200).json(successResponse('Article updated successfully.', article));
    } catch (err: any) {
      if (err instanceof ZodError) {
        res.status(400).json(errorResponse('Validation error.', err.errors.map(e => e.message)));
        return;
      }
      if (err.message === 'Forbidden.') {
        res.status(403).json(errorResponse('Forbidden.', [err.message]));
        return;
      }
      if (err.message === 'Article not found.') {
        res.status(404).json(errorResponse('Not found.', [err.message]));
        return;
      }
      res.status(500).json(errorResponse('Internal server error.', [err.message]));
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await articleService.softDeleteArticle(id, req.user!.id);
      res.status(200).json(successResponse('Article deleted successfully.'));
    } catch (err: any) {
      if (err.message === 'Forbidden.') {
        res.status(403).json(errorResponse('Forbidden.', [err.message]));
        return;
      }
      if (err.message === 'Article not found.') {
        res.status(404).json(errorResponse('Not found.', [err.message]));
        return;
      }
      res.status(500).json(errorResponse('Internal server error.', [err.message]));
    }
  }

  async getPublicArticles(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        category: req.query.category as string,
        authorName: req.query.author as string,
        keyword: req.query.q as string
      };
      const result = await articleService.getPublishedArticles(filters, page, limit);
      res.status(200).json(paginatedResponse('Articles retrieved.', result.items, page, limit, result.total));
    } catch (err: any) {
      res.status(500).json(errorResponse('Internal server error.', [err.message]));
    }
  }

  async getArticleById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const article = await articleService.getArticleById(req.params.id);
      
      // We will handle ReadLog tracking here via BullMQ later in the analytics module or service
      
      res.status(200).json(successResponse('Article retrieved.', article));
    } catch (err: any) {
      if (err.message === 'News article no longer available') {
        res.status(404).json(errorResponse('News article no longer available', [err.message]));
        return;
      }
      res.status(500).json(errorResponse('Internal server error.', [err.message]));
    }
  }
}

export const articleController = new ArticleController();
