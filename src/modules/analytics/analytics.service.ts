import prisma from '../../db/prisma';

export class AnalyticsService {
  async trackRead(articleId: string, readerId?: string) {
    // Non-blocking insert
    prisma.readLog.create({
      data: {
        articleId,
        readerId
      }
    }).catch(err => console.error('Failed to track read:', err));
  }

  async getAuthorDashboard(authorId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    // Get articles (excluding soft-deleted) with aggregated view counts
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { authorId, deletedAt: null },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          createdAt: true,
          dailyStats: {
            select: { viewCount: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.article.count({ where: { authorId, deletedAt: null } })
    ]);

    const items = articles.map(article => ({
      id: article.id,
      title: article.title,
      createdAt: article.createdAt,
      TotalViews: article.dailyStats.reduce((sum, stat) => sum + stat.viewCount, 0)
    }));

    return { items, total };
  }
}

export const analyticsService = new AnalyticsService();
