import RNFS from 'react-native-fs';
import { Platform, Share } from 'react-native';
import { StorageService } from './storage';
import NetInfo from '@react-native-community/netinfo';

class FileManager {
  static baseDir = Platform.OS === 'ios' 
    ? RNFS.DocumentDirectoryPath 
    : RNFS.ExternalDirectoryPath;

  static async downloadInvoice(month, url) {
    try {
      // Check network status
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('No internet connection');
      }

      const fileName = `invoice_${month}.pdf`;
      const filePath = `${this.baseDir}/invoices/${fileName}`;

      // Create directory if it doesn't exist
      await RNFS.mkdir(`${this.baseDir}/invoices`);

      // Check if file already exists in cache
      const exists = await RNFS.exists(filePath);
      if (exists) {
        return filePath;
      }

      // Download file
      const response = await RNFS.downloadFile({
        fromUrl: url,
        toFile: filePath,
        background: true,
        discretionary: true,
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Download progress: ${progress}%`);
        }
      }).promise;

      if (response.statusCode === 200) {
        // Cache file info
        await StorageService.saveData(`invoice_${month}`, {
          path: filePath,
          timestamp: Date.now()
        });
        return filePath;
      }
      throw new Error('Download failed');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  }

  static async shareInvoice(filePath) {
    try {
      const options = {
        title: 'Share Invoice',
        type: 'application/pdf',
        url: Platform.OS === 'ios' ? filePath : `file://${filePath}`
      };
      await Share.share(options);
    } catch (error) {
      console.error('Error sharing invoice:', error);
      throw error;
    }
  }

  static async clearCache() {
    try {
      const invoiceDir = `${this.baseDir}/invoices`;
      await RNFS.unlink(invoiceDir);
      await StorageService.clearAll();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  static async getCachedInvoices() {
    try {
      const invoiceDir = `${this.baseDir}/invoices`;
      const files = await RNFS.readDir(invoiceDir);
      return files.map(file => ({
        name: file.name,
        path: file.path,
        size: file.size,
        timestamp: file.mtime
      }));
    } catch (error) {
      console.error('Error getting cached invoices:', error);
      return [];
    }
  }
}

export default FileManager; 