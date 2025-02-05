import BackgroundFetch from 'react-native-background-fetch';
import SyncService from './sync';
import NotificationService from './notifications';
import { StorageService, STORAGE_KEYS } from './storage';

class BackgroundSyncService {
  static async init() {
    // Configure background fetch
    BackgroundFetch.configure({
      minimumFetchInterval: 15, // Fetch every 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY
    }, this.onBackgroundFetch, (error) => {
      console.error('Background fetch failed:', error);
    });

    // Start background fetch
    BackgroundFetch.start();
  }

  static async onBackgroundFetch() {
    try {
      // Check for pending submissions
      const pendingSubmissions = await StorageService.getData(STORAGE_KEYS.PENDING_SUBMISSIONS);
      
      if (pendingSubmissions?.length > 0) {
        const syncResult = await SyncService.syncData();
        
        if (syncResult) {
          NotificationService.showLocalNotification(
            'Sync Complete',
            'Your pending submissions have been uploaded successfully'
          );
        }
      }

      // Update cached data
      await SyncService.updateCache();

      // Signal completion
      BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
    } catch (error) {
      console.error('Background fetch error:', error);
      BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_FAILED);
    }
  }

  static scheduleSync(minutes = 15) {
    BackgroundFetch.scheduleTask({
      taskId: 'com.mkexports.sync',
      delay: minutes * 60 * 1000, // Convert minutes to milliseconds
      periodic: true
    });
  }

  static stopSync() {
    BackgroundFetch.stop();
  }
}

export default BackgroundSyncService; 