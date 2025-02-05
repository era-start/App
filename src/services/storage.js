import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  PRODUCTS: '@products',
  SALARY: '@salary',
  INVOICES: '@invoices',
  ASSIGNMENTS: '@assignments',
  CACHE_TIMESTAMP: '@cache_timestamp',
};

// Cache expiration time (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

class StorageService {
  static async saveData(key, data) {
    try {
      const jsonValue = JSON.stringify({
        data,
        timestamp: Date.now()
      });
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  static async getData(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (!jsonValue) return null;
      
      const { data, timestamp } = JSON.parse(jsonValue);
      
      // Check if cache is expired
      if (Date.now() - timestamp > CACHE_EXPIRATION) {
        await AsyncStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  }

  static async removeData(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }

  static async clearAll() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // File handling methods
  static async saveFile(fileName, fileData) {
    try {
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.writeFile(path, fileData, 'base64');
      return path;
    } catch (error) {
      console.error('Error saving file:', error);
      return null;
    }
  }

  static async getFile(fileName) {
    try {
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const exists = await RNFS.exists(path);
      if (!exists) return null;
      return await RNFS.readFile(path, 'base64');
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }

  static async removeFile(fileName) {
    try {
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.unlink(path);
    } catch (error) {
      console.error('Error removing file:', error);
    }
  }
}

export { StorageService, STORAGE_KEYS }; 