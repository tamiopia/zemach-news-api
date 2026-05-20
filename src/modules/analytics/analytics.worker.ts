import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import prisma from '../../db/prisma';
import logger from '../../utils/logger';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6380', 10),
  maxRetriesPerRequest: null
});

export const analyticsQueue = new Queue('DailyAnalytics', { connection });

export const setupAnalyticsJob = async () => {
  // Run daily at midnight GMT
  await analyticsQueue.add('aggregate', {}, {
    repeat: { pattern: '0 0 * * *' }
  });
};

export const analyticsWorker = new Worker('DailyAnalytics', async (job: Job) => {
  logger.info('Starting daily analytics aggregation job.');

  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  yesterday.setUTCHours(0, 0, 0, 0);

  const endOfYesterday = new Date(yesterday);
  endOfYesterday.setUTCHours(23, 59, 59, 999);

  // Group read logs by article ID
  const readCounts = await prisma.readLog.groupBy({
    by: ['articleId'],
    where: {
      readAt: {
        gte: yesterday,
        lte: endOfYesterday
      }
    },
    _count: {
      id: true
    }
  });

  // Upsert daily analytics
  for (const count of readCounts) {
    await prisma.dailyAnalytics.upsert({
      where: {
        articleId_date: {
          articleId: count.articleId,
          date: yesterday
        }
      },
      update: {
        viewCount: { increment: count._count.id }
      },
      create: {
        articleId: count.articleId,
        date: yesterday,
        viewCount: count._count.id
      }
    });
  }

  logger.info(`Aggregated ${readCounts.length} articles for ${yesterday.toISOString()}.`);
}, { connection });

analyticsWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed with error ${err.message}`);
});
