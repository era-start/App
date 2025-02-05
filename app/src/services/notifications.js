import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

const NOTIFICATION_TEMPLATES = {
  SYNC_COMPLETE: {
    title: 'Sync Complete',
    body: 'Your data has been synchronized successfully'
  },
  NEW_ASSIGNMENT: {
    title: 'New Assignment',
    body: 'You have received a new product assignment'
  },
  SALARY_CREDITED: {
    title: 'Salary Credited',
    body: 'Your salary has been credited'
  },
  SUBMISSION_SUCCESS: {
    title: 'Submission Successful',
    body: 'Your product submission has been processed'
  },
  DEADLINE_REMINDER: {
    title: 'Deadline Reminder',
    body: 'You have assignments due soon'
  }
};

class NotificationService {
  static channelId = 'mk-exports-default';

  static async init() {
    if (Platform.OS === 'ios') {
      await this.requestIOSPermissions();
    } else {
      this.createAndroidChannel();
    }

    // Configure local notifications
    PushNotification.configure({
      onNotification: this.onNotification,
      onRegister: this.onRegister,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
    });

    // Listen to FCM messages
    messaging().setBackgroundMessageHandler(this.onBackgroundMessage);
    messaging().onMessage(this.onForegroundMessage);

    // Get FCM token
    const token = await this.getFCMToken();
    if (token) {
      await this.updateFCMToken(token);
    }

    // Listen to token refresh
    messaging().onTokenRefresh(this.updateFCMToken);
  }

  static createAndroidChannel() {
    PushNotification.createChannel({
      channelId: this.channelId,
      channelName: 'Default Channel',
      channelDescription: 'Default notification channel',
      importance: 4,
      vibrate: true,
      playSound: true
    });
  }

  static async requestIOSPermissions() {
    const authStatus = await messaging().requestPermission({
      alert: true,
      badge: true,
      sound: true,
    });
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
  }

  static async getFCMToken() {
    try {
      const token = await messaging().getToken();
      await AsyncStorage.setItem('fcmToken', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  static async updateFCMToken(token) {
    try {
      const userToken = await AsyncStorage.getItem('token');
      await fetch('your-api-url/update-fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ fcmToken: token })
      });
    } catch (error) {
      console.error('Error updating FCM token:', error);
    }
  }

  static onNotification(notification) {
    if (notification.userInteraction) {
      this.handleNotificationTap(notification);
    }
  }

  static handleNotificationTap(notification) {
    const { type, data } = notification.data || {};
    switch (type) {
      case 'NEW_ASSIGNMENT':
        // Navigate to assignments screen
        break;
      case 'SALARY_CREDITED':
        // Navigate to salary details
        break;
      default:
        // Default navigation
        break;
    }
  }

  static showNotification(template, data = {}) {
    const notificationConfig = NOTIFICATION_TEMPLATES[template];
    if (!notificationConfig) return;

    PushNotification.localNotification({
      channelId: this.channelId,
      title: notificationConfig.title,
      message: this.formatMessage(notificationConfig.body, data),
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      ...data
    });
  }

  static formatMessage(template, data) {
    return template.replace(/\{(\w+)\}/g, (match, key) => data[key] || match);
  }

  static scheduleNotification(template, data = {}, date) {
    const notificationConfig = NOTIFICATION_TEMPLATES[template];
    if (!notificationConfig) return;

    PushNotification.localNotificationSchedule({
      channelId: this.channelId,
      title: notificationConfig.title,
      message: this.formatMessage(notificationConfig.body, data),
      date: new Date(date),
      allowWhileIdle: true,
      ...data
    });
  }

  static cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  static onForegroundMessage(message) {
    PushNotification.localNotification({
      title: message.notification.title,
      message: message.notification.body,
      ...message.data
    });
  }

  static onBackgroundMessage(message) {
    // Handle background messages
    return Promise.resolve();
  }

  static onRegister(token) {
    // Handle token registration
  }
}

export default NotificationService; 