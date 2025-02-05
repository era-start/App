import NetInfo from '@react-native-community/netinfo';
import { StorageService, STORAGE_KEYS } from './storage';
import { productApi, salaryApi } from './api';

class SyncService {
  static async syncData() {
    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        return false;
      }

      // Sync pending product submissions
      await this.syncPendingSubmissions();
      
      // Fetch and cache latest data
      await this.updateCache();

      return true;
    } catch (error) {
      console.error('Sync error:', error);
      return false;
    }
  }

  static async syncPendingSubmissions() {
    try {
      const pendingSubmissions = await StorageService.getData(STORAGE_KEYS.PENDING_SUBMISSIONS) || [];
      
      for (const submission of pendingSubmissions) {
        try {
          await productApi.submitProduct(submission);
          // Remove successful submission from pending list
          pendingSubmissions.splice(pendingSubmissions.indexOf(submission), 1);
        } catch (error) {
          console.error('Error syncing submission:', error);
        }
      }

      // Update pending submissions in storage
      await StorageService.saveData(STORAGE_KEYS.PENDING_SUBMISSIONS, pendingSubmissions);
    } catch (error) {
      console.error('Error in syncPendingSubmissions:', error);
    }
  }

  static async updateCache() {
    try {
      // Fetch latest data
      const [assignments, salaryDetails] = await Promise.all([
        productApi.getAssignments(),
        salaryApi.getSalaryDetails()
      ]);

      // Update cache
      await Promise.all([
        StorageService.saveData(STORAGE_KEYS.ASSIGNMENTS, assignments),
        StorageService.saveData(STORAGE_KEYS.SALARY, salaryDetails)
      ]);
    } catch (error) {
      console.error('Error updating cache:', error);
    }
  }

  static async addPendingSubmission(submission) {
    try {
      const pendingSubmissions = await StorageService.getData(STORAGE_KEYS.PENDING_SUBMISSIONS) || [];
      pendingSubmissions.push(submission);
      await StorageService.saveData(STORAGE_KEYS.PENDING_SUBMISSIONS, pendingSubmissions);
    } catch (error) {
      console.error('Error adding pending submission:', error);
    }
  }
}

export default SyncService; 