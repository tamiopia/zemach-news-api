import app from './app';
import { setupAnalyticsJob } from './modules/analytics/analytics.worker';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await setupAnalyticsJob();
  console.log(`Server running on port ${PORT}`);
});
