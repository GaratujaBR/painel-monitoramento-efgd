const cron = require('node-cron');
const googleSheetsService = require('./googlesheets.service');

class SyncService {
  constructor() {
    this.syncSchedule = '*/15 * * * *'; // Regular sync every 15 minutes
    this.syncJob = null;
  }

  async start() {
    if (this.syncJob) {
      return;
    }

    // Initialize the service
    await this.initialize();

    // Start regular sync
    this.syncJob = cron.schedule(this.syncSchedule, async () => {
      try {
        console.log('Starting scheduled sync...', new Date().toISOString());
        await this.fullSync();
        console.log('Scheduled sync completed', new Date().toISOString());
      } catch (error) {
        console.error('Scheduled sync failed:', error);
      }
    });

    console.log('Google Sheets sync service started');
  }

  async initialize() {
    try {
      const dataService = new googleSheetsService();
      await dataService.initialize();
      
      // Initial data fetch
      await this.fullSync();
    } catch (error) {
      console.error('Failed to initialize sync service:', error);
      throw error;
    }
  }

  async fullSync() {
    try {
      const dataService = new googleSheetsService();
      await dataService.initialize();
      await dataService.getInitiatives({ forceRefresh: true });
    } catch (error) {
      console.error('Full sync failed:', error);
      throw error;
    }
  }

  stop() {
    if (this.syncJob) {
      this.syncJob.stop();
      this.syncJob = null;
      console.log('Google Sheets sync service stopped');
    }
  }

  async syncNow() {
    try {
      console.log('Manual sync started...', new Date().toISOString());
      await this.fullSync();
      console.log('Manual sync completed', new Date().toISOString());
    } catch (error) {
      console.error('Manual sync failed:', error);
      throw error;
    }
  }
}

module.exports = new SyncService();
