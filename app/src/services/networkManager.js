import NetInfo from '@react-native-community/netinfo';
import { Subject } from 'rxjs';

class NetworkManager {
  static networkStatus$ = new Subject();
  static isConnected = true;
  static retryAttempts = 3;
  static retryDelay = 1000;

  static init() {
    NetInfo.addEventListener(state => {
      this.isConnected = state.isConnected;
      this.networkStatus$.next(state);
    });
  }

  static async withRetry(operation, attempts = this.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === attempts - 1) throw error;
        await this.delay(this.retryDelay * Math.pow(2, i));
      }
    }
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async checkConnectivity() {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected;
  }

  static onNetworkChange(callback) {
    return this.networkStatus$.subscribe(callback);
  }

  static async waitForConnection() {
    if (await this.checkConnectivity()) return true;
    
    return new Promise(resolve => {
      const subscription = this.networkStatus$.subscribe(state => {
        if (state.isConnected) {
          subscription.unsubscribe();
          resolve(true);
        }
      });
    });
  }
}

export default NetworkManager; 