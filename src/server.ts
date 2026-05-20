import app from './app';
import { setupAnalyticsJob } from './modules/analytics/analytics.worker';
import logger from './utils/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await setupAnalyticsJob();
  logger.info(`Server successfully started and listening on port ${PORT}`);
  logger.info(`API Documentation available at http://localhost:${PORT}/docs`);
  logger.info(`Background Analytics Jobs initialized and scheduled.`);
});
