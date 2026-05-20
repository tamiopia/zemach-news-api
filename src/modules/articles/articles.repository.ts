import prisma from '../../db/prisma';
import { Prisma, Article } from '@prisma/client';

export class ArticleRepository {
  async create(data: Prisma.ArticleUncheckedCreateInput): Promise<Article> {
    return await prisma.article.create({ data });
  }

  async findById(id: string): Promise<Article | null> {
    return await prisma.article.findFirst({
      where: { id, deletedAt: null }
    });
  }

  async update(id: string, data: Prisma.ArticleUpdateInput): Promise<Article> {
    return await prisma.article.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string): Promise<Article> {
    return await prisma.article.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async findAuthorArticles(authorId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.article.findMany({
        where: { authorId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.article.count({ where: { authorId, deletedAt: null } })
    ]);
    return { items, total };
  }

  async findPublishedArticles(filters: { category?: string; authorName?: string; keyword?: string }, page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const where: Prisma.ArticleWhereInput = {
      status: 'PUBLISHED',
      deletedAt: null
    };

    if (filters.category) {
      where.category = filters.category;
    }
    
    if (filters.authorName) {
      where.author = {
        name: { contains: filters.authorName, mode: 'insensitive' }
      };
    }

    if (filters.keyword) {
      where.title = { contains: filters.keyword, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.article.count({ where })
    ]);
    
    return { items, total };
  }
}

export const articleRepository = new ArticleRepository();
