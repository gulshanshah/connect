const cron = require('node-cron');
const Story = require('../models/Story');
const deleteFiles = require('./deleteFiles');

cron.schedule('0 * * * *', async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const expiredStories = await Story.find({ createdAt: { $lt: oneDayAgo } });

    if (expiredStories.length > 0) {
      const filePaths = expiredStories.map(story => story.imagePath);

      deleteFiles(filePaths);

      await Story.deleteMany({ createdAt: { $lt: oneDayAgo } });

      console.log(`[CRON] Deleted ${expiredStories.length} expired stories and their images.`);
    } else {
      console.log(`[CRON] No expired stories found at ${new Date().toLocaleString()}`);
    }
  } catch (error) {
    console.error('[CRON] Error during cleanup:', error.message);
  }
});
